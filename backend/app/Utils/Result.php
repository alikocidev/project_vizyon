<?php

namespace App\Utils;

class Result
{
    public $isSuccess;
    public $data;
    public $error;

    private function __construct(bool $isSuccess, $data = null, string $error = null)
    {
        $this->isSuccess = $isSuccess;
        $this->data = $data;
        $this->error = $error;
    }

    public static function success($data)
    {
        return new self(true, $data);
    }

    public static function failure(string $error)
    {
        return new self(false, null, $error);
    }
}
