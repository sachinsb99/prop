<?php

namespace App\Http\Controllers;

use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PropertyImageController extends Controller
{
    /**
     * Store a newly created property image.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'property_id' => 'required|exists:properties,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'alt_text' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Handle file upload
            $image = $request->file('image');
            $imagePath = $image->store('property-images', 'public');

            // Get the next sort order if not provided
            $sortOrder = $request->sort_order ?? PropertyImage::where('property_id', $request->property_id)->max('sort_order') + 1;

            // Create property image record
            $propertyImage = PropertyImage::create([
                'property_id' => $request->property_id,
                'image_path' => $imagePath,
                'alt_text' => $request->alt_text,
                'sort_order' => $sortOrder
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Property image uploaded successfully',
                'data' => $propertyImage
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified property image.
     */
    public function destroy(PropertyImage $propertyImage): JsonResponse
    {
        try {
            // Delete the image file from storage
            if (Storage::disk('public')->exists($propertyImage->image_path)) {
                Storage::disk('public')->delete($propertyImage->image_path);
            }

            // Delete the database record
            $propertyImage->delete();

            return response()->json([
                'success' => true,
                'message' => 'Property image deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reorder property images.
     */
    public function reorder(Request $request, PropertyImage $propertyImage): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'sort_order' => 'required|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $newSortOrder = $request->sort_order;
            $oldSortOrder = $propertyImage->sort_order;
            $propertyId = $propertyImage->property_id;

            // Update sort orders for other images in the same property
            if ($newSortOrder > $oldSortOrder) {
                // Moving down: decrease sort_order for images between old and new positions
                PropertyImage::where('property_id', $propertyId)
                    ->where('sort_order', '>', $oldSortOrder)
                    ->where('sort_order', '<=', $newSortOrder)
                    ->decrement('sort_order');
            } else if ($newSortOrder < $oldSortOrder) {
                // Moving up: increase sort_order for images between new and old positions
                PropertyImage::where('property_id', $propertyId)
                    ->where('sort_order', '>=', $newSortOrder)
                    ->where('sort_order', '<', $oldSortOrder)
                    ->increment('sort_order');
            }

            // Update the current image's sort order
            $propertyImage->update(['sort_order' => $newSortOrder]);

            return response()->json([
                'success' => true,
                'message' => 'Property image reordered successfully',
                'data' => $propertyImage->fresh()
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reorder image',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}