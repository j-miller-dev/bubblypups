<?php

namespace Tests\Feature;

use Tests\TestCase;

class AddDogToDatabaseTest extends TestCase
{
    public function testBasic()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
