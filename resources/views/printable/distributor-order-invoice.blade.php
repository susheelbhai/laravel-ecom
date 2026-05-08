<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tax Invoice — {{ $order->order_number }}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #000;
            background: #fff;
            padding: 30px;
        }

        /* ── Outer border ── */
        .invoice-wrapper {
            border: 1px solid #000;
        }

        /* ── Title bar ── */
        .title-bar {
            text-align: center;
            padding: 8px;
            border-bottom: 1px solid #000;
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        /* ── Two-column rows ── */
        .row-2col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-bottom: 1px solid #000;
        }
        .row-2col .col {
            padding: 10px 12px;
        }
        .row-2col .col:first-child {
            border-right: 1px solid #000;
        }
        .row-2col.row-3col {
            grid-template-columns: 1fr 1fr 1fr;
        }
        .row-2col.row-3col .col:nth-child(2) {
            border-right: 1px solid #000;
        }

        .label {
            font-size: 10px;
            color: #555;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
        }
        .value {
            font-size: 12px;
            font-weight: 600;
            color: #000;
        }
        .value.large {
            font-size: 15px;
        }
        .meta-line {
            font-size: 11px;
            line-height: 1.7;
            color: #222;
        }
        .meta-line strong { font-weight: 700; }

        /* ── Items table ── */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            border-bottom: 1px solid #000;
        }
        .items-table thead tr {
            background: #f0f0f0;
            border-bottom: 1px solid #000;
        }
        .items-table thead th {
            padding: 8px 10px;
            text-align: left;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            border-right: 1px solid #ccc;
        }
        .items-table thead th:last-child { border-right: none; }
        .items-table thead th.right { text-align: right; }
        .items-table tbody tr {
            border-bottom: 1px solid #e0e0e0;
        }
        .items-table tbody tr:last-child { border-bottom: none; }
        .items-table tbody td {
            padding: 8px 10px;
            font-size: 12px;
            border-right: 1px solid #e0e0e0;
        }
        .items-table tbody td:last-child { border-right: none; }
        .items-table tbody td.right { text-align: right; }

        /* ── Totals ── */
        .totals-section {
            display: grid;
            grid-template-columns: 1fr 280px;
            border-bottom: 1px solid #000;
        }
        .totals-section .amount-words {
            padding: 10px 12px;
            border-right: 1px solid #000;
            font-size: 11px;
            line-height: 1.6;
        }
        .totals-section .amount-words .label { margin-bottom: 4px; }
        .totals-box {
            padding: 0;
        }
        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 12px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 12px;
        }
        .totals-row:last-child { border-bottom: none; }
        .totals-row.grand {
            font-weight: 700;
            font-size: 13px;
            background: #f0f0f0;
            border-top: 1px solid #000;
            border-bottom: none;
        }
        .totals-row.paid-row { color: #065f46; }
        .totals-row.balance-row { color: #b91c1c; font-weight: 700; }

        /* ── Payment history ── */
        .section-heading {
            padding: 6px 12px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: #f0f0f0;
            border-bottom: 1px solid #000;
        }

        /* ── Footer ── */
        .footer-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
        .footer-row .col {
            padding: 12px;
            font-size: 11px;
            line-height: 1.7;
            color: #444;
        }
        .footer-row .col:first-child {
            border-right: 1px solid #000;
        }
        .sig-line {
            width: 140px;
            border-top: 1px solid #000;
            margin-top: 36px;
            margin-bottom: 4px;
        }

        /* ── Print ── */
        @media print {
            body { padding: 10px; }
            .no-print { display: none !important; }
        }
    </style>
</head>
<body>

<div class="no-print" style="text-align:right; margin-bottom:16px;">
    <button onclick="window.print()"
        style="padding:8px 20px; background:#1a1a1a; color:#fff; border:none; border-radius:4px; font-size:13px; cursor:pointer;">
        Print / Save as PDF
    </button>
</div>

@php
    // Determine IGST vs CGST+SGST
    $sellerStateId     = $setting?->state_id;
    $buyerStateId      = $order->distributor?->state_id;
    $isInterState      = ($sellerStateId && $buyerStateId) && ($sellerStateId !== $buyerStateId);
    $taxable           = (float) $order->subtotal_amount;
    $totalGst          = (float) ($order->tax_amount ?? 0);
    $igstAmount        = $isInterState ? $totalGst : 0;
    $cgstAmount        = !$isInterState ? $totalGst / 2 : 0;
    $sgstAmount        = !$isInterState ? $totalGst / 2 : 0;
    $amountPaid        = (float) ($order->amount_paid ?? 0);
    $remaining         = max(0, (float) $order->total_amount - $amountPaid);
@endphp

<div class="invoice-wrapper">

    {{-- ── Title ── --}}
    <div class="title-bar">Tax Invoice</div>

    {{-- ── Seller | Invoice details ── --}}
    <div class="row-2col">
        <div class="col">
            <div class="label">Seller</div>
            <div class="value large">{{ $setting?->app_name ?? config('app.name') }}</div>
            <div class="meta-line" style="margin-top:6px;">
                @if($setting?->address)
                    {{ $setting->address }}<br>
                @endif
                @if($setting?->state)
                    State: {{ $setting->state->name }}
                    ({{ $setting->state->gst_state_code }})<br>
                @endif
                @if($setting?->phone)
                    Phone: {{ $setting->phone }}<br>
                @endif
                @if($setting?->email)
                    Email: {{ $setting->email }}<br>
                @endif
                @if($setting?->gstin)
                    <strong>GSTIN: {{ $setting->gstin }}</strong>
                @endif
            </div>
        </div>
        <div class="col">
            <div style="margin-bottom:10px;">
                <div class="label">Invoice Number</div>
                <div class="value">{{ $order->order_number }}</div>
            </div>
            <div style="margin-bottom:10px;">
                <div class="label">Invoice Date</div>
                <div class="value">{{ ($order->approved_at ?? $order->created_at)->format('d M Y') }}</div>
            </div>
            <div style="margin-bottom:10px;">
                <div class="label">Order Date</div>
                <div class="value">{{ $order->created_at->format('d M Y') }}</div>
            </div>
            <div>
                <div class="label">Supply Type</div>
                <div class="value">{{ $isInterState ? 'Inter-State (IGST)' : 'Intra-State (CGST + SGST)' }}</div>
            </div>
        </div>
    </div>

    {{-- ── Bill To ── --}}
    <div class="row-2col">
        <div class="col">
            <div class="label">Bill To</div>
            <div class="value">{{ $order->distributor?->name }}</div>
            <div class="meta-line" style="margin-top:6px;">
                @if($order->distributor?->legal_business_name)
                    {{ $order->distributor->legal_business_name }}<br>
                @endif
                @if($order->distributor?->address)
                    {{ $order->distributor->address }}<br>
                @endif
                @if($order->distributor?->state)
                    State: {{ $order->distributor->state->name }}
                    ({{ $order->distributor->state->gst_state_code }})<br>
                @endif
                @if($order->distributor?->pincode)
                    Pincode: {{ $order->distributor->pincode }}<br>
                @endif
                @if($order->distributor?->email)
                    {{ $order->distributor->email }}<br>
                @endif
                @if($order->distributor?->phone)
                    {{ $order->distributor->phone }}<br>
                @endif
                @if($order->distributor?->gstin)
                    <strong>GSTIN: {{ $order->distributor->gstin }}</strong>
                @endif
            </div>
        </div>
        <div class="col">
            @if($order->sourceWarehouse)
            <div class="label">Dispatch From</div>
            <div class="value">{{ $order->sourceWarehouse->name }}</div>
            <div class="meta-line" style="margin-top:4px;">
                @if($order->sourceWarehouse->state)
                    State: {{ $order->sourceWarehouse->state->name }}<br>
                @endif
            </div>
            @endif
        </div>
    </div>

    {{-- ── Items table ── --}}
    <table class="items-table">
        <thead>
            <tr>
                <th style="width:30px;">#</th>
                <th>Description of Goods</th>
                <th class="right" style="width:90px;">Unit Price (₹)</th>
                <th class="right" style="width:50px;">Qty</th>
                <th class="right" style="width:100px;">Taxable Value (₹)</th>
                @if($isInterState)
                    <th class="right" style="width:90px;">IGST (₹)</th>
                @else
                    <th class="right" style="width:80px;">CGST (₹)</th>
                    <th class="right" style="width:80px;">SGST (₹)</th>
                @endif
                <th class="right" style="width:110px;">Total (₹)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $i => $item)
            @php
                $itemTaxable  = (float) $item->subtotal;
                $itemGstTotal = (float) ($item->tax_amount ?? 0);
                $itemTotal    = $itemTaxable + $itemGstTotal;
                $itemGstRate  = (float) ($item->gst_rate ?? 0);
            @endphp
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>
                    {{ $item->product?->title ?? 'Product #'.$item->product_id }}
                    @if($item->product?->sku)
                        <br><span style="font-size:10px; color:#888;">SKU: {{ $item->product->sku }}</span>
                    @endif
                    @if($item->product?->hsn_code)
                        <br><span style="font-size:10px; color:#888;">HSN: {{ $item->product->hsn_code }}</span>
                    @endif
                </td>
                <td class="right">{{ number_format($item->unit_price, 2) }}</td>
                <td class="right">{{ $item->quantity }}</td>
                <td class="right">{{ number_format($itemTaxable, 2) }}</td>
                @if($isInterState)
                    <td class="right">{{ $itemGstRate }}%<br>{{ number_format($itemGstTotal, 2) }}</td>
                @else
                    <td class="right">{{ $itemGstRate / 2 }}%<br>{{ number_format($itemGstTotal / 2, 2) }}</td>
                    <td class="right">{{ $itemGstRate / 2 }}%<br>{{ number_format($itemGstTotal / 2, 2) }}</td>
                @endif
                <td class="right">{{ number_format($itemTotal, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    {{-- ── Totals ── --}}
    <div class="totals-section">
        <div class="amount-words">
            <div class="label">Amount in Words</div>
            <div style="font-style:italic; font-size:12px;">
                {{-- Simple rupee word conversion not available without a library; show placeholder --}}
                ₹ {{ number_format($order->total_amount, 2) }} only
            </div>
            @if($order->distributor?->gstin)
            <div style="margin-top:10px; font-size:11px; color:#555;">
                Reverse Charge: No
            </div>
            @endif
        </div>
        <div class="totals-box">
            <div class="totals-row">
                <span>Taxable Amount</span>
                <span>₹ {{ number_format($taxable, 2) }}</span>
            </div>
            @if($isInterState)
            <div class="totals-row">
                <span>IGST</span>
                <span>₹ {{ number_format($igstAmount, 2) }}</span>
            </div>
            @else
            <div class="totals-row">
                <span>CGST</span>
                <span>₹ {{ number_format($cgstAmount, 2) }}</span>
            </div>
            <div class="totals-row">
                <span>SGST</span>
                <span>₹ {{ number_format($sgstAmount, 2) }}</span>
            </div>
            @endif
            <div class="totals-row grand">
                <span>Invoice Total</span>
                <span>₹ {{ number_format($order->total_amount, 2) }}</span>
            </div>
            @if($amountPaid > 0)
            <div class="totals-row paid-row">
                <span>Amount Paid</span>
                <span>₹ {{ number_format($amountPaid, 2) }}</span>
            </div>
            @endif
            @if($remaining > 0)
            <div class="totals-row balance-row">
                <span>Balance Due</span>
                <span>₹ {{ number_format($remaining, 2) }}</span>
            </div>
            @endif
        </div>
    </div>

    {{-- ── Payment history ── --}}
    @if($order->payments->isNotEmpty())
    <div class="section-heading">Payment History</div>
    <table class="items-table" style="border-bottom:1px solid #000;">
        <thead>
            <tr>
                <th>Date</th>
                <th>Method</th>
                <th>Note</th>
                <th class="right">Amount (₹)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->payments->sortBy('created_at') as $payment)
            <tr>
                <td>{{ $payment->created_at?->format('d M Y') }}</td>
                <td>{{ ucfirst($payment->payment_method) }}</td>
                <td>{{ $payment->note ?? '—' }}</td>
                <td class="right">{{ number_format($payment->amount, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    {{-- ── Footer ── --}}
    <div class="footer-row">
        <div class="col">
            <strong>Terms &amp; Conditions</strong><br>
            This is a computer-generated invoice and does not require a physical signature.<br>
            For queries, contact {{ $setting?->email ?? config('app.name') }}.
        </div>
        <div class="col" style="text-align:right;">
            <div>For <strong>{{ $setting?->app_name ?? config('app.name') }}</strong></div>
            <div class="sig-line" style="margin-left:auto;"></div>
            <div>Authorised Signatory</div>
        </div>
    </div>

</div>{{-- /.invoice-wrapper --}}

</body>
</html>
