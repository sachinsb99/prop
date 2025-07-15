<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EnquiryRequest;
use App\Models\HomeEnquiry;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EnquiryController extends Controller
{
    /**
     * Store a new enquiry
     */
    public function store(EnquiryRequest $request): JsonResponse
    {
        Log::info($request->all());
        try {
            $enquiry = HomeEnquiry::create($request->validated());

            // Send notification emails (optional)
            $this->sendNotificationEmails($enquiry);

            return response()->json([
                'success' => true,
                'message' => 'Enquiry submitted successfully! We\'ll contact you within 24 hours.',
                'data' => [
                    'enquiry_id' => $enquiry->id,
                    'status' => $enquiry->status,
                    'created_at' => $enquiry->formatted_created_at
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Enquiry submission failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get all enquiries (for admin dashboard)
     */
    // public function index(Request $request): JsonResponse
    // {
    //     $perPage = $request->get('per_page', 15);
    //     $status = $request->get('status');
    //     $search = $request->get('search');

    //     $query = HomeEnquiry::latest();

    //     // Filter by status
    //     if ($status) {
    //         $query->where('status', $status);
    //     }

    //     // Search functionality
    //     if ($search) {
    //         $query->where(function($q) use ($search) {
    //             $q->where('name', 'like', "%{$search}%")
    //               ->orWhere('email', 'like', "%{$search}%")
    //               ->orWhere('message', 'like', "%{$search}%");
    //         });
    //     }

    //     $enquiries = $query->paginate($perPage);

    //     return response()->json([
    //         'success' => true,
    //         'data' => $enquiries,
    //         'stats' => [
    //             'total' => HomeEnquiry::count(),
    //             'pending' => HomeEnquiry::pending()->count(),
    //             'processing' => HomeEnquiry::processing()->count(),
    //             'completed' => HomeEnquiry::completed()->count(),
    //         ]
    //     ]);
    // }

    /**
     * Get a specific enquiry
     */
    // public function show(HomeEnquiry $enquiry): JsonResponse
    // {
    //     return response()->json([
    //         'success' => true,
    //         'data' => $enquiry
    //     ]);
    // }

    /**
     * Update enquiry status
     */
    // public function updateStatus(Request $request, HomeEnquiry $enquiry): JsonResponse
    // {
    //     $request->validate([
    //         'status' => 'required|in:pending,processing,completed,cancelled'
    //     ]);

    //     $enquiry->update([
    //         'status' => $request->status,
    //         'responded_at' => in_array($request->status, ['completed', 'cancelled']) ? now() : null
    //     ]);

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Status updated successfully',
    //         'data' => $enquiry
    //     ]);
    // }

    /**
     * Delete an enquiry
     */
    // public function destroy(HomeEnquiry $enquiry): JsonResponse
    // {
    //     $enquiry->delete();

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Enquiry deleted successfully'
    //     ]);
    // }

    /**
     * Send notification emails
     */
    private function sendNotificationEmails(HomeEnquiry $enquiry)
    {
        try {
            // Send confirmation email to customer
            Mail::send('emails.enquiry.confirmation', compact('enquiry'), function ($message) use ($enquiry) {
                $message->to($enquiry->email, $enquiry->name)
                       ->subject('Your Home Enquiry - Confirmation');
            });

            // Send notification email to admin
            $adminEmail = config('mail.admin_email', 'admin@example.com');
            Mail::send('emails.enquiry.notification', compact('enquiry'), function ($message) use ($adminEmail) {
                $message->to($adminEmail)
                       ->subject('New Home Enquiry Received');
            });

        } catch (\Exception $e) {
            Log::error('Failed to send enquiry emails: ' . $e->getMessage());
        }
    }
}
