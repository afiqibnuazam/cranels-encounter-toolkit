<?php

namespace App\Services\Srd;

use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class Dnd5eApiService
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.dnd5eapi.base_url', 'https://www.dnd5eapi.co/api/2014');
    }

    public function getSpellIndex(): array
    {
        try {
            $response = Http::get("{$this->baseUrl}/spells");
            return $response->ok() ? $response->json('results') : [];
        } catch (Exception $e) {
            Log::error('Error fetching spells: ' . $e->getMessage());
            return [];
        }
    }

    public function getSpellDetail(string $index): ?array
    {
        try {
            $response = Http::get("{$this->baseUrl}/spells/{$index}");
            return $response->ok() ? $response->json() : null;
        } catch (Exception $e) {
            Log::error('Error fetching spell detail: ' . $e->getMessage());
            return null;
        }
    }

    public function getMonsterIndex(): array
    {
        try {
            $response = Http::get("{$this->baseUrl}/monsters");
            return $response->ok() ? $response->json('results') : [];
        } catch (Exception $e) {
            Log::error('Error fetching monsters: ' . $e->getMessage());
            return [];
        }
    }

    public function getMonsterDetail(string $index): ?array
    {
        try {
            $response = Http::get("{$this->baseUrl}/monsters/{$index}");
            return $response->ok() ? $response->json() : null;
        } catch (Exception $e) {
            Log::error('Error fetching monster detail: ' . $e->getMessage());
            return null;
        }
    }

    public function getConditionIndex(): array
    {
        try {
            $response = Http::get("{$this->baseUrl}/conditions");
            return $response->ok() ? $response->json('results') : [];
        } catch (Exception $e) {
            Log::error('Error fetching conditions: ' . $e->getMessage());
            return [];
        }
    }

    public function getConditionDetail(string $index): ?array
    {
        try {
            $response = Http::get("{$this->baseUrl}/conditions/{$index}");
            return $response->ok() ? $response->json() : null;
        } catch (Exception $e) {
            Log::error('Error fetching condition detail: ' . $e->getMessage());
            return null;
        }
    }

    public function getDamageTypeIndex()
    {
        try {
            $response = Http::get("{$this->baseUrl}/damage-types");
            return $response->ok() ? $response->json('results') : [];
        } catch (Exception $e) {
            Log::error('Error fetching damage types: ' . $e->getMessage());
            return [];
        }
    }

    public function getDamageTypeDetail(string $index) {
        try {
            $response = Http::get("{$this->baseUrl}/damage-types/{$index}");
            return $response->ok() ? $response->json() : null;
        } catch (Exception $e) {
            Log::error('Error fetching damage type detail: ' . $e->getMessage());
            return null;
        }
    }
}
