<?php

use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// ──────────────────────────────────────────────
// Public blog listing
// ──────────────────────────────────────────────

it('shows published posts on the public blog', function () {
    $published = BlogPost::factory()->published()->create(['title' => 'A Published Post']);
    $draft = BlogPost::factory()->draft()->create(['title' => 'A Draft Post']);

    $response = $this->get('/blog');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Blog')
        ->has('posts.data', 1)
        ->where('posts.data.0.title', 'A Published Post')
    );
});

it('does not show draft posts on the public blog', function () {
    BlogPost::factory()->draft()->create();

    $response = $this->get('/blog');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Blog')
        ->has('posts.data', 0)
    );
});

it('shows an empty state when there are no published posts', function () {
    $response = $this->get('/blog');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Blog')
        ->has('posts.data', 0)
    );
});

// ──────────────────────────────────────────────
// Public blog show
// ──────────────────────────────────────────────

it('shows a published post at its slug URL', function () {
    $post = BlogPost::factory()->published()->create(['slug' => 'my-post']);

    $response = $this->get('/blog/my-post');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Blog/Show')
        ->where('post.slug', 'my-post')
    );
});

it('returns 404 for a draft post on the public blog show page', function () {
    $post = BlogPost::factory()->draft()->create(['slug' => 'draft-post']);

    $this->get('/blog/draft-post')->assertNotFound();
});

it('returns 404 for a future-scheduled post', function () {
    $post = BlogPost::factory()->create([
        'slug' => 'future-post',
        'published_at' => now()->addDay(),
    ]);

    $this->get('/blog/future-post')->assertNotFound();
});

// ──────────────────────────────────────────────
// Admin authentication guard
// ──────────────────────────────────────────────

it('redirects unauthenticated users from the admin blog index', function () {
    $this->get('/admin/blog')->assertRedirect('/login');
});

// ──────────────────────────────────────────────
// Admin CRUD
// ──────────────────────────────────────────────

it('shows the admin blog index to authenticated users', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/blog')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Dashboard/Blog'));
});

it('allows an admin to create a blog post', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/admin/blog', [
        'title' => 'Top 5 Grooming Tips',
        'slug' => 'top-5-grooming-tips',
        'excerpt' => 'A short excerpt.',
        'body' => '<p>Content here.</p>',
        'category' => 'grooming_tips',
        'cover_image_url' => null,
        'published_at' => null,
    ]);

    $response->assertRedirect(route('admin.blog.index'));
    $this->assertDatabaseHas('blog_posts', [
        'title' => 'Top 5 Grooming Tips',
        'slug' => 'top-5-grooming-tips',
        'user_id' => $user->id,
    ]);
});

it('validates required fields when creating a blog post', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/admin/blog', [])
        ->assertSessionHasErrors(['title', 'slug', 'body', 'category']);
});

it('allows an admin to update a blog post', function () {
    $user = User::factory()->create();
    $post = BlogPost::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->patch("/admin/blog/{$post->id}", [
        'title' => 'Updated Title',
        'slug' => 'updated-title',
        'excerpt' => null,
        'body' => '<p>Updated content.</p>',
        'category' => 'dog_care',
        'cover_image_url' => null,
        'published_at' => null,
    ]);

    $response->assertRedirect(route('admin.blog.index'));
    $this->assertDatabaseHas('blog_posts', [
        'id' => $post->id,
        'title' => 'Updated Title',
        'category' => 'dog_care',
    ]);
});

it('allows an admin to delete a blog post', function () {
    $user = User::factory()->create();
    $post = BlogPost::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->delete("/admin/blog/{$post->id}")
        ->assertRedirect();

    $this->assertDatabaseMissing('blog_posts', ['id' => $post->id]);
});

it('allows an admin to publish a draft post', function () {
    $user = User::factory()->create();
    $post = BlogPost::factory()->draft()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->patch("/admin/blog/{$post->id}/publish")
        ->assertRedirect();

    $this->assertNotNull($post->fresh()->published_at);
});

it('allows an admin to unpublish a published post', function () {
    $user = User::factory()->create();
    $post = BlogPost::factory()->published()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->patch("/admin/blog/{$post->id}/publish")
        ->assertRedirect();

    $this->assertNull($post->fresh()->published_at);
});

it('prevents duplicate slugs when creating', function () {
    $user = User::factory()->create();
    BlogPost::factory()->create(['slug' => 'existing-slug']);

    $this->actingAs($user)
        ->post('/admin/blog', [
            'title' => 'Another Post',
            'slug' => 'existing-slug',
            'body' => '<p>Body</p>',
            'category' => 'dog_care',
        ])
        ->assertSessionHasErrors(['slug']);
});
