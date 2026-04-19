<?php

use Illuminate\Support\Facades\Schema;

it('indexes active products by created_at for the default catalog query', function () {
    expect(Schema::hasIndex('products', 'idx_products_active_created_at'))->toBeTrue();
});
