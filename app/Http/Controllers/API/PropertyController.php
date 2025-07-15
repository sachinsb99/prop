<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PropertyController extends Controller
{
    // public function index(Request $request): JsonResponse
    // {
    //     $query = Property::with(['category:id,name', 'images:id,property_id,image_path'])
    //         ->select('id', 'name', 'location', 'category_id', 'price_per_square_feet', 'status', 'is_featured', 'main_image', 'created_at');

    //     // Filters
    //     if ($request->has('category_id')) {
    //         $query->where('category_id', $request->category_id);
    //     }

    //     if ($request->has('status')) {
    //         $query->where('status', $request->status);
    //     }

    //     if ($request->has('is_featured')) {
    //         $query->where('is_featured', $request->boolean('is_featured'));
    //     }

    //     if ($request->has('search')) {
    //         $query->where(function($q) use ($request) {
    //             $q->where('name', 'like', '%' . $request->search . '%')
    //               ->orWhere('location', 'like', '%' . $request->search . '%');
    //         });
    //     }

    //     $properties = $query->latest()->paginate(10);

    //     return response()->json([
    //         'success' => true,
    //         'data' => $properties
    //     ]);
    // }

    public function index(): JsonResponse
    {
        //Log::info('Index Reached..........');
        try {
            $properties = Property::with('category')
                ->orderBy('created_at', 'desc')
                ->get();
            //Log::info('properties: ', [$properties]);
            return response()->json([
                'success' => true,
                'data' => $properties
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching properties: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch properties'
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            Log::info('Headers:', $request->headers->all());
            Log::info('All data:', $request->all());
            Log::info('Files:', $request->allFiles());

            // Validation rules
            $rules = [
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'property_category_id' => 'required|exists:property_categories,id',
                'location' => 'required|string|max:255',
                'address' => 'nullable|string|max:255',
                'latitude' => 'nullable|numeric|between:-90,90',
                'longitude' => 'nullable|numeric|between:-180,180',
                'price_per_square_feet' => 'required|numeric|min:0',
                'total_area' => 'nullable|numeric|min:0',
                'built_area' => 'nullable|numeric|min:0',
                'bedrooms' => 'nullable|integer|min:0',
                'bathrooms' => 'nullable|integer|min:0',
                'parking_spaces' => 'nullable|integer|min:0',
                'year_built' => 'nullable|integer|min:1900|max:' . date('Y'),
                'main_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'amenities' => 'nullable|string', // Will be JSON string
                'status' => 'required|in:available,sold,rented,pending',
                'is_featured' => 'boolean',
                'is_active' => 'boolean',
            ];

            $validatedData = $request->validate($rules);

            // Generate slug from name
            $validatedData['slug'] = Str::slug($validatedData['name']);
            
            // Ensure unique slug
            $originalSlug = $validatedData['slug'];
            $counter = 1;
            while (Property::where('slug', $validatedData['slug'])->exists()) {
                $validatedData['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }

            // Handle main image upload
            if ($request->hasFile('main_image')) {
                $image = $request->file('main_image');
                $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('properties', $imageName, 'public');
                $validatedData['main_image'] = $imagePath;
            }

            // Handle amenities JSON
            if ($request->has('amenities')) {
                $amenities = $request->input('amenities');
                if (is_string($amenities)) {
                    // Validate JSON
                    $decodedAmenities = json_decode($amenities, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $validatedData['amenities'] = $amenities;
                    } else {
                        $validatedData['amenities'] = null;
                    }
                } else {
                    $validatedData['amenities'] = json_encode($amenities);
                }
            }

            // Convert string boolean values to actual booleans
            $validatedData['is_featured'] = filter_var($request->input('is_featured', false), FILTER_VALIDATE_BOOLEAN);
            $validatedData['is_active'] = filter_var($request->input('is_active', true), FILTER_VALIDATE_BOOLEAN);

            // Create property
            $property = Property::create($validatedData);

            // Load the property with relationships
            $property->load('category');

            Log::info('Property created successfully: ', $property->toArray());

            return response()->json([
                'success' => true,
                'message' => 'Property created successfully',
                'data' => $property
            ], 201);

        } catch (ValidationException $e) {
            Log::error('Validation failed: ', $e->errors());
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating property: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create property: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(Property $property): JsonResponse
    {
        Log::info('SHOW property...');
        try {
            $property->load('category');
            Log::info('Property details: ', [$property]);
            return response()->json([
                'success' => true,
                'data' => $property
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching property: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch property'
            ], 500);
        }
    }

    public function update(Request $request, Property $property): JsonResponse
    {
        try {
            Log::info('Update Property Request: ', $request->all());

            // Same validation rules as store
            $rules = [
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'property_category_id' => 'required|exists:property_categories,id',
                'location' => 'required|string|max:255',
                'address' => 'nullable|string|max:255',
                'latitude' => 'nullable|numeric|between:-90,90',
                'longitude' => 'nullable|numeric|between:-180,180',
                'price_per_square_feet' => 'required|numeric|min:0',
                'total_area' => 'nullable|numeric|min:0',
                'built_area' => 'nullable|numeric|min:0',
                'bedrooms' => 'nullable|integer|min:0',
                'bathrooms' => 'nullable|integer|min:0',
                'parking_spaces' => 'nullable|integer|min:0',
                'year_built' => 'nullable|integer|min:1900|max:' . date('Y'),
                'main_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'amenities' => 'nullable|string',
                'status' => 'required|in:available,sold,rented,pending',
                'is_featured' => 'boolean',
                'is_active' => 'boolean',
            ];

            $validatedData = $request->validate($rules);

            // Update slug if name changed
            if ($validatedData['name'] !== $property->name) {
                $validatedData['slug'] = Str::slug($validatedData['name']);
                
                // Ensure unique slug
                $originalSlug = $validatedData['slug'];
                $counter = 1;
                while (Property::where('slug', $validatedData['slug'])->where('id', '!=', $property->id)->exists()) {
                    $validatedData['slug'] = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }

            // Handle main image upload
            if ($request->hasFile('main_image')) {
                // Delete old image if exists
                if ($property->main_image && Storage::disk('public')->exists($property->main_image)) {
                    Storage::disk('public')->delete($property->main_image);
                }

                $image = $request->file('main_image');
                $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('properties', $imageName, 'public');
                $validatedData['main_image'] = $imagePath;
            }

            // Handle amenities JSON
            if ($request->has('amenities')) {
                $amenities = $request->input('amenities');
                if (is_string($amenities)) {
                    $decodedAmenities = json_decode($amenities, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $validatedData['amenities'] = $amenities;
                    } else {
                        $validatedData['amenities'] = null;
                    }
                } else {
                    $validatedData['amenities'] = json_encode($amenities);
                }
            }

            // Convert string boolean values to actual booleans
            $validatedData['is_featured'] = filter_var($request->input('is_featured', $property->is_featured), FILTER_VALIDATE_BOOLEAN);
            $validatedData['is_active'] = filter_var($request->input('is_active', $property->is_active), FILTER_VALIDATE_BOOLEAN);

            // Update property
            $property->update($validatedData);
            $property->load('category');

            return response()->json([
                'success' => true,
                'message' => 'Property updated successfully',
                'data' => $property
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating property: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update property'
            ], 500);
        }
    }

    public function destroy(Property $property): JsonResponse
    {
        try {
            // Delete main image if exists
            if ($property->main_image && Storage::disk('public')->exists($property->main_image)) {
                Storage::disk('public')->delete($property->main_image);
            }

            $property->delete();

            return response()->json([
                'success' => true,
                'message' => 'Property deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting property: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete property'
            ], 500);
        }
    }

    // public function store(Request $request): JsonResponse
    // {
    //     Log::info('Store ProP: ', $request->all());
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //         'description' => 'required|string',
    //         'category_id' => 'required|exists:categories,id',
    //         'location' => 'required|string|max:255',
    //         'address' => 'nullable|string',
    //         'latitude' => 'nullable|numeric|between:-90,90',
    //         'longitude' => 'nullable|numeric|between:-180,180',
    //         'price_per_square_feet' => 'required|numeric|min:0',
    //         'total_area' => 'nullable|numeric|min:0',
    //         'built_area' => 'nullable|numeric|min:0',
    //         'bedrooms' => 'nullable|integer|min:0',
    //         'bathrooms' => 'nullable|integer|min:0',
    //         'parking_spaces' => 'nullable|integer|min:0',
    //         'year_built' => 'nullable|integer|min:1800|max:' . (date('Y') + 5),
    //         'main_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    //         'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    //         'amenities' => 'nullable|array',
    //         'status' => 'required|in:available,sold,rented,pending',
    //         'is_featured' => 'boolean',
    //         'is_active' => 'boolean'
    //     ]);

    //     DB::beginTransaction();
    //     try {
    //         $propertyData = $request->except(['main_image', 'images']);

    //         // Handle main image upload
    //         if ($request->hasFile('main_image')) {
    //             $mainImagePath = $request->file('main_image')->store('properties/main', 'public');
    //             $propertyData['main_image'] = $mainImagePath;
    //         }

    //         $property = Property::create($propertyData);

    //         // Handle additional images
    //         if ($request->hasFile('images')) {
    //             foreach ($request->file('images') as $index => $image) {
    //                 $imagePath = $image->store('properties/gallery', 'public');
    //                 PropertyImage::create([
    //                     'property_id' => $property->id,
    //                     'image_path' => $imagePath,
    //                     'sort_order' => $index
    //                 ]);
    //             }
    //         }

    //         DB::commit();

    //         $property->load(['category', 'images']);

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Property created successfully',
    //             'data' => $property
    //         ], 201);

    //     } catch (\Exception $e) {
    //         DB::rollback();
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Error creating property: ' . $e->getMessage()
    //         ], 500);
    //     }
    // }

    // public function show(Property $property): JsonResponse
    // {
    //     $property->load(['category', 'images']);

    //     return response()->json([
    //         'success' => true,
    //         'data' => $property
    //     ]);
    // }

    // public function update(Request $request, Property $property): JsonResponse
    // {
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //         'description' => 'required|string',
    //         'category_id' => 'required|exists:categories,id',
    //         'location' => 'required|string|max:255',
    //         'address' => 'nullable|string',
    //         'latitude' => 'nullable|numeric|between:-90,90',
    //         'longitude' => 'nullable|numeric|between:-180,180',
    //         'price_per_square_feet' => 'required|numeric|min:0',
    //         'total_area' => 'nullable|numeric|min:0',
    //         'built_area' => 'nullable|numeric|min:0',
    //         'bedrooms' => 'nullable|integer|min:0',
    //         'bathrooms' => 'nullable|integer|min:0',
    //         'parking_spaces' => 'nullable|integer|min:0',
    //         'year_built' => 'nullable|integer|min:1800|max:' . (date('Y') + 5),
    //         'main_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    //         'amenities' => 'nullable|array',
    //         'status' => 'required|in:available,sold,rented,pending',
    //         'is_featured' => 'boolean',
    //         'is_active' => 'boolean'
    //     ]);

    //     DB::beginTransaction();
    //     try {
    //         $propertyData = $request->except(['main_image', 'images']);

    //         // Handle main image upload
    //         if ($request->hasFile('main_image')) {
    //             // Delete old main image
    //             if ($property->main_image) {
    //                 Storage::disk('public')->delete($property->main_image);
    //             }
    //             $mainImagePath = $request->file('main_image')->store('properties/main', 'public');
    //             $propertyData['main_image'] = $mainImagePath;
    //         }

    //         $property->update($propertyData);

    //         DB::commit();

    //         $property->load(['category', 'images']);

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Property updated successfully',
    //             'data' => $property
    //         ]);

    //     } catch (\Exception $e) {
    //         DB::rollback();
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Error updating property: ' . $e->getMessage()
    //         ], 500);
    //     }
    // }

    // public function destroy(Property $property): JsonResponse
    // {
    //     DB::beginTransaction();
    //     try {
    //         // Delete main image
    //         if ($property->main_image) {
    //             Storage::disk('public')->delete($property->main_image);
    //         }

    //         // Delete gallery images
    //         foreach ($property->images as $image) {
    //             Storage::disk('public')->delete($image->image_path);
    //         }

    //         $property->delete();

    //         DB::commit();

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Property deleted successfully'
    //         ]);

    //     } catch (\Exception $e) {
    //         DB::rollback();
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Error deleting property: ' . $e->getMessage()
    //         ], 500);
    //     }
    // }
}