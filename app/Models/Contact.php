<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'message',
        'status',
        'ticket_number',
        'responded_at',
        'admin_response',
        'priority',
        'category',
        'metadata',
    ];

    protected $casts = [
        'responded_at' => 'datetime',
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $dates = [
        'responded_at',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    // Boot method to generate ticket number
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($contact) {
            $contact->ticket_number = self::generateTicketNumber();
        });
    }

    /**
     * Generate unique ticket number
     */
    private static function generateTicketNumber(): string
    {
        do {
            $ticketNumber = 'TKT-' . strtoupper(uniqid());
        } while (self::where('ticket_number', $ticketNumber)->exists());

        return $ticketNumber;
    }

    /**
     * Scope for filtering by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for filtering by priority
     */
    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope for recent contacts
     */
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Check if contact is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if contact is resolved
     */
    public function isResolved(): bool
    {
        return $this->status === 'resolved';
    }

    /**
     * Mark as responded
     */
    public function markAsResponded($response = null): void
    {
        $this->update([
            'responded_at' => now(),
            'admin_response' => $response,
            'status' => 'in_progress',
        ]);
    }

    /**
     * Mark as resolved
     */
    public function markAsResolved(): void
    {
        $this->update([
            'status' => 'resolved',
        ]);
    }

    /**
     * Get status badge color
     */
    public function getStatusBadgeColorAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'yellow',
            'in_progress' => 'blue',
            'resolved' => 'green',
            'closed' => 'gray',
            default => 'gray',
        };
    }

    /**
     * Get priority badge color
     */
    public function getPriorityBadgeColorAttribute(): string
    {
        return match ($this->priority) {
            'low' => 'green',
            'medium' => 'yellow',
            'high' => 'orange',
            'urgent' => 'red',
            default => 'gray',
        };
    }

    /**
     * Get formatted created date
     */
    public function getFormattedCreatedDateAttribute(): string
    {
        return $this->created_at->format('M d, Y h:i A');
    }
}