<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ContactFormSubmitted;
use App\Mail\ContactFormConfirmation;

class ContactController extends Controller
{
    /**
     * Store a newly created contact form submission.
     */
    public function store(Request $request): JsonResponse
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|min:2',
            'email' => 'required|email|max:255',
            'message' => 'required|string|min:10|max:5000',
            'category' => 'nullable|string|in:support,bug,feature,billing,other',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Get client information
            $metadata = [
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'referrer' => $request->header('referer'),
                'submitted_at' => now()->toISOString(),
            ];

            // Create contact record
            $contact = Contact::create([
                'name' => $request->name,
                'email' => $request->email,
                'message' => $request->message,
                'category' => $request->category ?? 'support',
                'priority' => $request->priority ?? 'medium',
                'metadata' => $metadata,
            ]);

            // Send notification emails
            $this->sendNotificationEmails($contact);

            // Log the submission
            Log::info('Contact form submitted', [
                'ticket_number' => $contact->ticket_number,
                'email' => $contact->email,
                'name' => $contact->name,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Your message has been sent successfully! We will get back to you soon.',
                'data' => [
                    'ticket_number' => $contact->ticket_number,
                    'status' => $contact->status,
                    'created_at' => $contact->created_at->toISOString(),
                ],
            ], 201);

        } catch (\Exception $e) {
            Log::error('Contact form submission failed', [
                'error' => $e->getMessage(),
                'email' => $request->email,
                'name' => $request->name,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send your message. Please try again later.',
            ], 500);
        }
    }

    /**
     * Get contact by ticket number
     */
    public function show(string $ticketNumber): JsonResponse
    {
        try {
            $contact = Contact::where('ticket_number', $ticketNumber)->firstOrFail();

            return response()->json([
                'success' => true,
                'data' => [
                    'ticket_number' => $contact->ticket_number,
                    'name' => $contact->name,
                    'email' => $contact->email,
                    'message' => $contact->message,
                    'status' => $contact->status,
                    'priority' => $contact->priority,
                    'category' => $contact->category,
                    'created_at' => $contact->created_at->toISOString(),
                    'responded_at' => $contact->responded_at?->toISOString(),
                    'admin_response' => $contact->admin_response,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket not found',
            ], 404);
        }
    }

    /**
     * Get all contacts (admin only)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Contact::query();

            // Apply filters
            if ($request->has('status')) {
                $query->byStatus($request->status);
            }

            if ($request->has('priority')) {
                $query->byPriority($request->priority);
            }

            if ($request->has('category')) {
                $query->where('category', $request->category);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('ticket_number', 'like', "%{$search}%");
                });
            }

            // Sort by created_at descending by default
            $query->orderBy('created_at', 'desc');

            // Paginate results
            $contacts = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $contacts->items(),
                'pagination' => [
                    'current_page' => $contacts->currentPage(),
                    'last_page' => $contacts->lastPage(),
                    'per_page' => $contacts->perPage(),
                    'total' => $contacts->total(),
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch contacts', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch contacts',
            ], 500);
        }
    }

    /**
     * Update contact status and response
     */
    public function update(Request $request, string $ticketNumber): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:pending,in_progress,resolved,closed',
            'admin_response' => 'nullable|string|max:5000',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $contact = Contact::where('ticket_number', $ticketNumber)->firstOrFail();

            $updateData = [
                'status' => $request->status,
                'priority' => $request->priority ?? $contact->priority,
            ];

            if ($request->filled('admin_response')) {
                $updateData['admin_response'] = $request->admin_response;
                $updateData['responded_at'] = now();
            }

            $contact->update($updateData);

            // Send response email if admin responded
            if ($request->filled('admin_response')) {
                $this->sendResponseEmail($contact);
            }

            return response()->json([
                'success' => true,
                'message' => 'Contact updated successfully',
                'data' => [
                    'ticket_number' => $contact->ticket_number,
                    'status' => $contact->status,
                    'priority' => $contact->priority,
                    'updated_at' => $contact->updated_at->toISOString(),
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to update contact', [
                'error' => $e->getMessage(),
                'ticket_number' => $ticketNumber,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update contact',
            ], 500);
        }
    }

    /**
     * Send notification emails
     */
    private function sendNotificationEmails(Contact $contact): void
    {
        try {
            // Send confirmation email to user
            Mail::to($contact->email)->send(new ContactFormConfirmation($contact));

            // Send notification email to admin
            $adminEmail = config('mail.admin_email', 'admin@example.com');
            Mail::to($adminEmail)->send(new ContactFormSubmitted($contact));

        } catch (\Exception $e) {
            Log::error('Failed to send notification emails', [
                'error' => $e->getMessage(),
                'ticket_number' => $contact->ticket_number,
            ]);
        }
    }

    /**
     * Send response email to user
     */
    private function sendResponseEmail(Contact $contact): void
    {
        try {
            // You can create a separate mail class for responses
            // Mail::to($contact->email)->send(new AdminResponseMail($contact));
        } catch (\Exception $e) {
            Log::error('Failed to send response email', [
                'error' => $e->getMessage(),
                'ticket_number' => $contact->ticket_number,
            ]);
        }
    }

    /**
     * Get contact statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_contacts' => Contact::count(),
                'pending_contacts' => Contact::byStatus('pending')->count(),
                'in_progress_contacts' => Contact::byStatus('in_progress')->count(),
                'resolved_contacts' => Contact::byStatus('resolved')->count(),
                'closed_contacts' => Contact::byStatus('closed')->count(),
                'recent_contacts' => Contact::recent(7)->count(),
                'high_priority_contacts' => Contact::byPriority('high')->count(),
                'urgent_priority_contacts' => Contact::byPriority('urgent')->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch contact statistics', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics',
            ], 500);
        }
    }
}