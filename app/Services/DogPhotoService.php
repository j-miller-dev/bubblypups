<?php

namespace App\Services;

use App\Models\Dog;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class DogPhotoService
{
    protected string $disk = 'public';

    protected string $directory = 'dog-photos';

    /**
     * Upload a photo for the given dog.
     * Deletes the old photo if one exists.
     */
    public function uploadPhoto(Dog $dog, UploadedFile $photo): string
    {
        // Delete existing photo if present
        if ($dog->photo_url) {
            $this->deletePhotoFromStorage($dog->photo_url);
        }

        // Generate a unique filename
        $filename = sprintf(
            '%d-%s.%s',
            $dog->id,
            uniqid(),
            $photo->getClientOriginalExtension()
        );

        // Store the file
        $path = $photo->storeAs($this->directory, $filename, $this->disk);

        // Generate the public URL
        $url = Storage::disk($this->disk)->url($path);

        // Update the dog's photo_url
        $dog->update(['photo_url' => $url]);

        return $url;
    }

    /**
     * Delete the dog's photo from storage and clear the photo_url.
     */
    public function deletePhoto(Dog $dog): bool
    {
        if (! $dog->photo_url) {
            return false;
        }

        $this->deletePhotoFromStorage($dog->photo_url);

        $dog->update(['photo_url' => null]);

        return true;
    }

    /**
     * Delete a photo file from storage given its URL.
     */
    protected function deletePhotoFromStorage(string $url): void
    {
        // Extract the path from the URL
        $path = $this->getPathFromUrl($url);

        if ($path && Storage::disk($this->disk)->exists($path)) {
            Storage::disk($this->disk)->delete($path);
        }
    }

    /**
     * Convert a storage URL back to a storage path.
     */
    protected function getPathFromUrl(string $url): ?string
    {
        // Get the storage URL prefix
        $storageUrl = Storage::disk($this->disk)->url('');

        // Remove the storage URL prefix to get the relative path
        if (str_starts_with($url, $storageUrl)) {
            return substr($url, strlen($storageUrl));
        }

        // Handle cases where only the path portion is stored
        if (str_contains($url, $this->directory)) {
            $pos = strpos($url, $this->directory);

            return substr($url, $pos);
        }

        return null;
    }
}
