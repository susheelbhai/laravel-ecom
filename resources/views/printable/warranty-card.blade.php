<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Warranty Card — {{ $card->card_number }}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #1a1a1a;
            background: #fff;
            padding: 30px;
        }

        .card-wrapper {
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #000;
        }

        /* ── Title bar ── */
        .title-bar {
            text-align: center;
            padding: 8px;
            border-bottom: 1px solid #000;
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            background: #f0f0f0;
        }

        /* ── Header: card number + issued by ── */
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 12px 14px;
            border-bottom: 1px solid #000;
        }
        .card-header .label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #888;
            margin-bottom: 3px;
        }
        .card-header .card-number {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            font-weight: 700;
        }
        .card-header .issued-by {
            text-align: right;
        }
        .card-header .issued-by .name {
            font-size: 12px;
            font-weight: 600;
        }

        /* ── Status badge ── */
        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .status-active { background: #d1fae5; color: #065f46; }
        .status-expired { background: #fee2e2; color: #991b1b; }

        /* ── 2-col grid rows ── */
        .row-2col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-bottom: 1px solid #e0e0e0;
        }
        .row-2col .col {
            padding: 10px 14px;
        }
        .row-2col .col:first-child {
            border-right: 1px solid #e0e0e0;
        }
        .field-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #888;
            margin-bottom: 3px;
        }
        .field-value {
            font-size: 12px;
            font-weight: 600;
            color: #1a1a1a;
        }
        .field-value.mono { font-family: 'Courier New', monospace; }
        .field-value.expires-active { color: #065f46; }
        .field-value.expires-expired { color: #991b1b; }

        /* ── Section heading ── */
        .section-heading {
            padding: 6px 14px;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #888;
            background: #f9f9f9;
            border-bottom: 1px solid #e0e0e0;
            border-top: 1px solid #e0e0e0;
        }

        /* ── Customer block ── */
        .customer-block {
            display: grid;
            grid-template-columns: 1fr 1fr;
            padding: 10px 14px;
            gap: 8px;
            border-bottom: 1px solid #e0e0e0;
        }
        .customer-block .name { font-weight: 700; font-size: 12px; }
        .customer-block .meta { font-size: 11px; color: #444; line-height: 1.6; }

        /* ── Terms ── */
        .terms-block {
            padding: 10px 14px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 11px;
            color: #555;
            line-height: 1.6;
            white-space: pre-line;
        }

        /* ── Footer ── */
        .card-footer {
            padding: 8px 14px;
            font-size: 10px;
            color: #aaa;
            display: flex;
            justify-content: space-between;
        }

        /* ── Print ── */
        @media print {
            body { padding: 10px; }
            .no-print { display: none !important; }
        }
    </style>
</head>
<body>

<div class="no-print" style="text-align:right; margin-bottom:16px; max-width:600px; margin-left:auto; margin-right:auto;">
    <button onclick="window.print()"
        style="padding:8px 20px; background:#1a1a1a; color:#fff; border:none; border-radius:4px; font-size:13px; cursor:pointer; margin-right:8px;">
        Print / Save as PDF
    </button>
    <a href="{{ route('dealer.warranty-cards.show', $card->id) }}"
        style="padding:8px 16px; background:#fff; color:#1a1a1a; border:1px solid #ccc; border-radius:4px; font-size:13px; text-decoration:none;">
        Back
    </a>
</div>

<div class="card-wrapper">

    {{-- ── Title ── --}}
    <div class="title-bar">Warranty Certificate</div>

    {{-- ── Card number + issued by ── --}}
    <div class="card-header">
        <div>
            <div class="label">Card Number</div>
            <div class="card-number">{{ $card->card_number }}</div>
            <div style="margin-top:6px;">
                @if($card->isExpired())
                    <span class="status-badge status-expired">Expired</span>
                @else
                    <span class="status-badge status-active">Active</span>
                @endif
            </div>
        </div>
        <div class="issued-by">
            <div class="label">Issued by</div>
            <div class="name">{{ $card->dealer?->name ?? $setting?->app_name ?? config('app.name') }}</div>
            @if($setting?->app_name && $card->dealer?->name !== $setting->app_name)
                <div style="font-size:11px; color:#666;">{{ $setting->app_name }}</div>
            @endif
        </div>
    </div>

    {{-- ── Product + Serial ── --}}
    <div class="row-2col">
        <div class="col">
            <div class="field-label">Product</div>
            <div class="field-value">{{ $card->product?->title ?? '—' }}</div>
            @if($card->product?->sku)
                <div style="font-size:10px; color:#888; margin-top:2px;">SKU: {{ $card->product->sku }}</div>
            @endif
        </div>
        <div class="col">
            <div class="field-label">Serial Number</div>
            <div class="field-value mono">{{ $card->serialNumber?->serial_number ?? '—' }}</div>
        </div>
    </div>

    {{-- ── Dates ── --}}
    <div class="row-2col">
        <div class="col">
            <div class="field-label">Purchase Date</div>
            <div class="field-value">{{ $card->purchase_date?->format('d M Y') ?? '—' }}</div>
        </div>
        <div class="col">
            <div class="field-label">Warranty Valid Until</div>
            <div class="field-value {{ $card->isExpired() ? 'expires-expired' : 'expires-active' }}">
                {{ $card->warranty_expires_at?->format('d M Y') ?? '—' }}
            </div>
        </div>
    </div>

    {{-- ── Customer ── --}}
    <div class="section-heading">Customer</div>
    <div class="customer-block">
        <div>
            <div class="name">{{ $card->sale?->customer_name ?? '—' }}</div>
            @if($card->sale?->customer_phone)
                <div class="meta">{{ $card->sale->customer_phone }}</div>
            @endif
            @if($card->sale?->customer_email)
                <div class="meta">{{ $card->sale->customer_email }}</div>
            @endif
        </div>
        <div class="meta">
            @php
                $parts = array_filter([
                    $card->sale?->billing_address_line1,
                    $card->sale?->billing_address_line2,
                    implode(', ', array_filter([
                        $card->sale?->billing_city,
                        $card->sale?->billingState?->name,
                        $card->sale?->billing_pincode,
                    ])),
                    $card->sale?->billing_country,
                ]);
            @endphp
            {{ implode(', ', $parts) }}
        </div>
    </div>

    {{-- ── Terms ── --}}
    @if($card->terms_snapshot)
    <div class="section-heading">Terms &amp; Conditions</div>
    <div class="terms-block">{{ $card->terms_snapshot }}</div>
    @endif

    {{-- ── Footer ── --}}
    <div class="card-footer">
        <span>Sale ref: {{ $card->sale?->sale_number ?? '—' }}</span>
        <span>{{ $setting?->app_name ?? config('app.name') }}</span>
    </div>

</div>

</body>
</html>
