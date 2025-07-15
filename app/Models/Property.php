<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;


class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'property_category_id',
        'location',
        'address',
        'latitude',
        'longitude',
        'price_per_square_feet',
        'total_area',
        'built_area',
        'bedrooms',
        'bathrooms',
        'parking_spaces',
        'year_built',
        'main_image',
        'amenities',
        'status',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'price_per_square_feet' => 'decimal:2',
        'total_area' => 'decimal:2',
        'built_area' => 'decimal:2',
        'bedrooms' => 'integer',
        'bathrooms' => 'integer',
        'parking_spaces' => 'integer',
        'year_built' => 'integer',
        'amenities' => 'array', // This will automatically handle JSON encoding/decoding
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'available',
        'is_featured' => false,
        'is_active' => true,
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(PropertyCategory::class, 'property_category_id');
    }

    // Accessor for main image URL
    public function getMainImageUrlAttribute(): ?string
    {
        if ($this->main_image) {
            return asset('storage/' . $this->main_image);
        }
        return null;
    }

    // Scope for active properties
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope for featured properties
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    // Scope for available properties
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }
}
// class Property extends Model
// {
//     use HasFactory;

//     protected $fillable = [
//         'name',
//         'slug',
//         'description',
//         'category_id',
//         'location',
//         'address',
//         'latitude',
//         'longitude',
//         'price_per_square_feet',
//         'total_area',
//         'built_area',
//         'bedrooms',
//         'bathrooms',
//         'parking_spaces',
//         'year_built',
//         'main_image',
//         'amenities',
//         'status',
//         'is_featured',
//         'is_active'
//     ];

//     protected $casts = [
//         'amenities' => 'array',
//         'is_featured' => 'boolean',
//         'is_active' => 'boolean',
//         'price_per_square_feet' => 'decimal:2',
//         'total_area' => 'decimal:2',
//         'built_area' => 'decimal:2',
//         'latitude' => 'decimal:8',
//         'longitude' => 'decimal:8',
//     ];

//     // Automatically generate slug when creating
//     protected static function boot()
//     {
//         parent::boot();
        
//         static::creating(function ($property) {
//             if (empty($property->slug)) {
//                 $property->slug = Str::slug($property->name);
//             }
//         });
//     }

//     // Relationships
//     public function category()
//     {
//         return $this->belongsTo(PropertyCategory::class);
//     }

//     public function images()
//     {
//         return $this->hasMany(PropertyImage::class)->orderBy('sort_order');
//     }

//     // Accessors
//     public function getTotalPriceAttribute()
//     {
//         return $this->price_per_square_feet * $this->total_area;
//     }

//     public function getMainImageUrlAttribute()
//     {
//         return $this->main_image ? asset('storage/' . $this->main_image) : null;
//     }

//     // Scopes
//     public function scopeActive($query)
//     {
//         return $query->where('is_active', true);
//     }

//     public function scopeFeatured($query)
//     {
//         return $query->where('is_featured', true);
//     }

//     public function scopeByStatus($query, $status)
//     {
//         return $query->where('status', $status);
//     }

//     public function scopeByCategory($query, $categoryId)
//     {
//         return $query->where('property_category_id', $categoryId);
//     }
// }
