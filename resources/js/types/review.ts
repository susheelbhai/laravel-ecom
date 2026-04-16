export interface Review {
    id: number;
    product_id: number;
    user_id: number;
    rating: number;
    title: string | null;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
    helpful_count: number;
    not_helpful_count: number;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        avatar?: string;
    };
    product?: {
        id: number;
        title: string;
        slug: string;
    };
    media?: ReviewMedia[];
    user_vote?: ReviewVote;
}

export interface ReviewMedia {
    id: number;
    file_name: string;
    mime_type: string;
    size: number;
    original_url: string;
    url: string;
    collection_name: 'images' | 'videos';
}

export interface ReviewVote {
    id: number;
    review_id: number;
    user_id: number;
    vote_type: 'helpful' | 'not_helpful';
    created_at: string;
    updated_at: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedReviews {
    data: Review[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

export interface RatingDistribution {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
}

export interface Product {
    id: number;
    title: string;
    slug: string;
    description?: string;
    price?: number;
}
