<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBlogPostRequest;
use App\Http\Requests\Admin\UpdateBlogPostRequest;
use App\Models\BlogPost;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BlogPostController extends Controller
{
    public function index(): Response
    {
        $posts = BlogPost::query()
            ->with('user')
            ->latest()
            ->paginate(20);

        return Inertia::render('Dashboard/Blog', [
            'posts' => $posts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Dashboard/Blog/Create');
    }

    public function store(StoreBlogPostRequest $request): RedirectResponse
    {
        BlogPost::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('admin.blog.index')->with('success', 'Blog post created successfully.');
    }

    public function edit(BlogPost $blogPost): Response
    {
        return Inertia::render('Dashboard/Blog/Edit', [
            'post' => $blogPost,
        ]);
    }

    public function update(UpdateBlogPostRequest $request, BlogPost $blogPost): RedirectResponse
    {
        $blogPost->update($request->validated());

        return redirect()->route('admin.blog.index')->with('success', 'Blog post updated successfully.');
    }

    public function destroy(BlogPost $blogPost): RedirectResponse
    {
        $blogPost->delete();

        return back()->with('success', 'Blog post deleted.');
    }

    public function publish(BlogPost $blogPost): RedirectResponse
    {
        $blogPost->published_at = $blogPost->published_at ? null : now();
        $blogPost->save();

        $message = $blogPost->published_at ? 'Post published.' : 'Post moved to draft.';

        return back()->with('success', $message);
    }
}
