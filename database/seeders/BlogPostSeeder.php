<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogPostSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first();

        // 6 published posts across different categories
        BlogPost::factory(6)
            ->published()
            ->create(['user_id' => $admin->id]);

        // 2 drafts in progress
        BlogPost::factory(2)
            ->draft()
            ->create(['user_id' => $admin->id]);

        $this->command->info('✓ Created '.BlogPost::count().' blog posts (6 published, 2 draft)');
    }
}
