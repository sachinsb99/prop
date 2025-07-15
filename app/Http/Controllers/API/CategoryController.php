<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PropertyCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = PropertyCategory::with('properties:id,property_category_id,name')
            ->withCount('properties')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:property_categories',
            'description' => 'nullable|string',
            'type' => 'required|in:open,close',
            'is_active' => 'boolean'
        ]);

        $category = PropertyCategory::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => $category
        ], 201);
    }

    public function show(PropertyCategory $category): JsonResponse
    {
        $category->load(['properties' => function($query) {
            $query->select('id', 'property_category_id', 'name', 'location', 'price_per_square_feet', 'status');
        }]);

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    public function update(Request $request, PropertyCategory $category): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('property_categories')->ignore($category->id)],
            'description' => 'nullable|string',
            'type' => 'required|in:open,close',
            'is_active' => 'boolean'
        ]);

        $category->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => $category
        ]);
    }

    public function destroy(PropertyCategory $category): JsonResponse
    {
        if ($category->properties()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete category with existing properties'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully'
        ]);
    }

    public function getActiveCategories(): JsonResponse
    {
        $categories = PropertyCategory::active()
            ->select('id', 'name', 'type')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }
}