<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class BlogController extends Controller
{
    public function index(): InertiaResponse
    {
        $posts = BlogPost::query()
            ->published()
            ->with('user')
            ->orderByDesc('published_at')
            ->paginate(9);

        return Inertia::render('Blog', [
            'posts' => $posts,
        ]);
    }

    public function show(BlogPost $blogPost): InertiaResponse|Response
    {
        if (! $blogPost->published_at || $blogPost->published_at->isFuture()) {
            abort(404);
        }

        $blogPost->load('user');

        return Inertia::render('Blog/Show', [
            'post' => $blogPost,
        ]);
    }
}
