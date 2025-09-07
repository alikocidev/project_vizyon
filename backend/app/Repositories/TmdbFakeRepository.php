<?php

namespace App\Repositories;

use App\Contracts\TmdbRepositoryInterface;
use App\Utils\Result;

class TmdbFakeRepository implements TmdbRepositoryInterface
{
    public function getMovieNowPlaying($page = 1): Result
    {
        $fakeMovies = [
            [
                'id' => 1184918,
                'title' => 'The Wild Robot',
                'original_title' => 'The Wild Robot',
                'overview' => 'Sahipsiz bir adada mahsur kalan robot Roz, zorlu çevre koşullarına uyum sağlamak zorundadır.',
                'poster_path' => '/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg',
                'backdrop_path' => '/4zlOPT9CrtIX05bBIkYxNZsm5zN.jpg',
                'release_date' => '2024-09-12',
                'vote_average' => 8.5,
                'vote_count' => 2847,
                'popularity' => 5820.364,
                'genre_ids' => [16, 878, 10751],
                'adult' => false,
                'video' => false,
                'original_language' => 'en'
            ],
            [
                'id' => 933260,
                'title' => 'The Substance',
                'original_title' => 'The Substance',
                'overview' => 'Yaşlanan bir ünlü, kendisini daha genç ve güzel bir versiyonuyla değiştirmesini sağlayan gizemli bir ilaç dener.',
                'poster_path' => '/lqoMzCcZYEFK729d6qzt349fB4o.jpg',
                'backdrop_path' => '/7h6TqPB3ESmjuVbxCxAeB1c9OB1.jpg',
                'release_date' => '2024-09-07',
                'vote_average' => 7.3,
                'vote_count' => 1832,
                'popularity' => 4842.451,
                'genre_ids' => [27, 878, 53],
                'adult' => false,
                'video' => false,
                'original_language' => 'en'
            ],
            [
                'id' => 1034541,
                'title' => 'Terrifier 3',
                'original_title' => 'Terrifier 3',
                'overview' => 'Art the Clown geri döndü ve Miles County sakinlerini Noel gecesi dehşete sürüklemeye hazır.',
                'poster_path' => '/l1175hgL5DoXnqeZQCcU3eZIdhX.jpg',
                'backdrop_path' => '/18TSJF1WLA4CkymvVUcKDBwUJ9F.jpg',
                'release_date' => '2024-10-09',
                'vote_average' => 6.9,
                'vote_count' => 845,
                'popularity' => 4234.567,
                'genre_ids' => [27, 53],
                'adult' => false,
                'video' => false,
                'original_language' => 'en'
            ]
        ];

        return Result::success($fakeMovies);
    }

    public function getMovieUpComing($page = 1): Result
    {
        $fakeMovies = [
            [
                'id' => 1159311,
                'title' => 'My Hero Academia: You\'re Next',
                'original_title' => '僕のヒーローアカデミア THE MOVIE ユアネクスト',
                'overview' => 'Pro kahramanlar ve UA Lisesi öğrencileri, gizemli bir suçlu organizasyonla karşı karşıya gelir.',
                'poster_path' => '/8rdB1wkheEMMqcY8qLAKjCMPcnZ.jpg',
                'backdrop_path' => '/cjEcqdRdPQJhYre3HUAc5538Gk8.jpg',
                'release_date' => '2024-08-02',
                'vote_average' => 6.8,
                'vote_count' => 123,
                'popularity' => 2847.123,
                'genre_ids' => [16, 28, 12],
                'adult' => false,
                'video' => false,
                'original_language' => 'ja'
            ],
            [
                'id' => 1144962,
                'title' => 'Transmorphers: Mech Beasts',
                'original_title' => 'Transmorphers: Mech Beasts',
                'overview' => 'Robot savaşçılar, dünyayı ele geçirmeye çalışan uzaylı güçlere karşı savaşır.',
                'poster_path' => '/oqhaffnQqSzdLrYAQA5W4IdAoCX.jpg',
                'backdrop_path' => '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
                'release_date' => '2023-06-09',
                'vote_average' => 5.2,
                'vote_count' => 45,
                'popularity' => 1234.567,
                'genre_ids' => [878, 28],
                'adult' => false,
                'video' => false,
                'original_language' => 'en'
            ]
        ];

        return Result::success($fakeMovies);
    }

    public function getMovieVideosById($movieId): Result
    {
        $fakeVideos = [
            [
                'id' => '507f1f77bcf86cd799439011',
                'iso_639_1' => 'en',
                'iso_3166_1' => 'US',
                'key' => 'dQw4w9WgXcQ',
                'name' => 'Official Trailer',
                'site' => 'YouTube',
                'size' => 1080,
                'type' => 'Trailer',
                'official' => true,
                'published_at' => '2024-08-15T14:30:00.000Z'
            ]
        ];

        return Result::success($fakeVideos);
    }

    public function getMovieDetail($movieId): Result
    {
        $fakeMovieDetail = [
            'id' => $movieId,
            'title' => 'The Wild Robot',
            'original_title' => 'The Wild Robot',
            'overview' => 'Sahipsiz bir adada mahsur kalan robot Roz, zorlu çevre koşullarına uyum sağlamak zorundadır ve beklenmedik şekilde yetim bir kaz yavrusunun koruyucu annesi haline gelir.',
            'poster_path' => '/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg',
            'backdrop_path' => '/4zlOPT9CrtIX05bBIkYxNZsm5zN.jpg',
            'release_date' => '2024-09-12',
            'vote_average' => 8.5,
            'vote_count' => 2847,
            'popularity' => 5820.364,
            'runtime' => 102,
            'budget' => 78000000,
            'revenue' => 149200000,
            'homepage' => 'https://www.thewildrobotmovie.com',
            'imdb_id' => 'tt29623480',
            'status' => 'Released',
            'tagline' => 'Discover your true nature.',
            'genres' => [
                ['id' => 16, 'name' => 'Animasyon'],
                ['id' => 878, 'name' => 'Bilim Kurgu'],
                ['id' => 10751, 'name' => 'Aile']
            ],
            'production_companies' => [
                [
                    'id' => 33,
                    'name' => 'Universal Pictures',
                    'logo_path' => '/8lvHyhjr8oUKOOy2dKXoALWKdp0.png',
                    'origin_country' => 'US'
                ]
            ],
            'production_countries' => [
                ['iso_3166_1' => 'US', 'name' => 'United States of America']
            ],
            'spoken_languages' => [
                ['iso_639_1' => 'en', 'name' => 'English']
            ],
            'credits' => [
                'cast' => [
                    [
                        'id' => 3223,
                        'name' => 'Lupita Nyong\'o',
                        'character' => 'Roz (voice)',
                        'profile_path' => '/y40Wu1T742kynOqtwXASc5Qgm49.jpg',
                        'order' => 0
                    ],
                    [
                        'id' => 1231,
                        'name' => 'Pedro Pascal',
                        'character' => 'Fink (voice)',
                        'profile_path' => '/9VYK7oxcqhjd5LAH6ZFJ3XzOhpx.jpg',
                        'order' => 1
                    ]
                ],
                'crew' => [
                    [
                        'id' => 1223,
                        'name' => 'Chris Sanders',
                        'job' => 'Director',
                        'profile_path' => '/8Q7QFPrZJwU8rDX0BfmnJhY8X0b.jpg'
                    ]
                ]
            ],
            'videos' => [
                'results' => [
                    [
                        'id' => '66e1234567890abcdef12345',
                        'iso_639_1' => 'en',
                        'iso_3166_1' => 'US',
                        'key' => '67vbqzycKrg',
                        'name' => 'The Wild Robot | Official Trailer',
                        'site' => 'YouTube',
                        'size' => 1080,
                        'type' => 'Trailer',
                        'official' => true,
                        'published_at' => '2024-06-18T16:00:10.000Z'
                    ]
                ]
            ],
        ];

        return Result::success($fakeMovieDetail);
    }

    public function getTrending($type, $page = 1, $window = 'week'): Result
    {
        $fakeData = [
            [
                'id' => 912649,
                'title' => 'Venom: The Last Dance',
                'original_title' => 'Venom: The Last Dance',
                'overview' => 'Eddie ve Venom\'un son macerası başlıyor.',
                'poster_path' => '/aosm8NMQ3UyoBVpSxyimorCQykC.jpg',
                'backdrop_path' => '/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg',
                'release_date' => '2024-10-22',
                'vote_average' => 8.1,
                'vote_count' => 1542,
                'popularity' => 6234.789,
                'genre_ids' => [878, 28, 12],
                'adult' => false,
                'video' => false,
                'original_language' => 'en',
                'media_type' => $type
            ]
        ];

        return Result::success($fakeData);
    }

    public function getMoviePopular($page = 1): Result
    {
        return $this->getMovieNowPlaying($page);
    }

    public function getMovieGoat($page = 1): Result
    {
        $fakeMovies = [
            [
                'id' => 238,
                'title' => 'The Godfather',
                'original_title' => 'The Godfather',
                'overview' => 'Güçlü bir İtalyan-Amerikan suç ailesinin patriği, kontrolü isteksiz oğluna devretmeye karar verir.',
                'poster_path' => '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
                'backdrop_path' => '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
                'release_date' => '1972-03-14',
                'vote_average' => 8.7,
                'vote_count' => 19384,
                'popularity' => 12345.678,
                'genre_ids' => [18, 80],
                'adult' => false,
                'video' => false,
                'original_language' => 'en'
            ]
        ];

        return Result::success($fakeMovies);
    }

    public function discoverByType($type, $filters, $page = 1): Result
    {
        return $this->getMoviePopular($page);
    }

    public function searchWithParams($type, $filters, $page = 1): Result
    {
        return $this->getMoviePopular($page);
    }
}
