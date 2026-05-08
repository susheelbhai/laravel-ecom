type FormType = {
    seller_id: number | string;
    product_category_id: number;

    title: string;
    slug: string;
    sku: string;

    short_description: string;
    description: string;
    long_description2: string;
    long_description3: string;
    features: string[];

    price: number;
    original_price: number;
    mrp: number;
    distributor_price: number;
    hsn_code: string;
    gst_rate: number;

    manage_stock: number;

    images: UploadValue;

    is_active: number;
    is_featured: number;

    meta_title: string;
    meta_description: string;
};

type UploadValue = File | string | null;
type CategoryOption = {
    id: number;
    title: string;
};
