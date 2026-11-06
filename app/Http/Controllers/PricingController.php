<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class PricingController extends Controller
{
    public function index(): Response
    {
        $sizes = ['small', 'medium', 'large'];

        $services = Service::all()->map(fn (Service $service) => [
            'id' => $service->id,
            'name' => $service->name,
            'description' => $service->description,
            'emoji' => $service->emoji,
            'pricing_tiers' => collect($sizes)->mapWithKeys(fn (string $size) => [
                $size => $service->getPriceForSize($size),
            ]),
            'duration_tiers' => collect($sizes)->mapWithKeys(fn (string $size) => [
                $size => $service->getDurationForSize($size),
            ]),
        ]);

        return Inertia::render('Pricing', [
            'services' => $services,
        ]);
    }
}
