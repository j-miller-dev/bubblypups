<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BlogPost>
 */
class BlogPostFactory extends Factory
{
    private static array $titles = [
        'grooming_tips' => [
            '5 Tips for Bathing Your Dog at Home',
            'How to Desensitize Your Pup to Grooming',
            'The Best Brushes for Every Coat Type',
            'How Often Should You Groom Your Dog?',
            'Nail Trimming 101: A Step-by-Step Guide',
        ],
        'breed_guides' => [
            'Grooming the Golden Retriever: What You Need to Know',
            'Doodle Coat Care: Preventing Matting and Tangles',
            'The Poodle Clip: A Comprehensive Guide',
            'Shih Tzu Grooming: Keeping the Coat Silky Smooth',
            'Labrador Shedding Season Survival Guide',
        ],
        'dog_care' => [
            'Signs Your Dog Needs a Grooming Appointment ASAP',
            'Post-Bath Care: Drying and Finishing Tips',
            'How to Keep Your Dog Calm During Grooming',
            'Ear Cleaning 101: Safe Practices for Dog Owners',
            'Dental Hygiene for Dogs: More Than Just a Smile',
        ],
        'business_news' => [
            'Bubbly Pups Now Offers Extended Weekend Hours',
            'Introducing Our New Puppy Package',
            'Meet Our Newest Groomer Joining the Team',
            'Bubbly Pups Is Moving to a Bigger Space',
            'Holiday Booking Now Open — Reserve Your Spot Early',
        ],
    ];

    public function definition(): array
    {
        $category = fake()->randomElement(['grooming_tips', 'breed_guides', 'dog_care', 'business_news']);
        $title = fake()->randomElement(self::$titles[$category]);
        $slug = Str::slug($title).'-'.fake()->unique()->randomNumber(4);

        return [
            'user_id' => User::factory(),
            'title' => $title,
            'slug' => $slug,
            'excerpt' => fake()->sentences(2, true),
            'body' => '<p>'.implode('</p><p>', fake()->paragraphs(4)).'</p>',
            'category' => $category,
            'cover_image_url' => null,
            'published_at' => null,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => now()->subDays(fake()->numberBetween(1, 60)),
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => null,
        ]);
    }
}
