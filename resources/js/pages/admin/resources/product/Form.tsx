import { FormContainer } from '@/components/form/container/form-container';
import InputDiv from '@/components/form/container/input-div';

export default function Form({
    submit,
    inputDivData,
    processing,
    categories,
}: {
    submit: (e: React.FormEvent) => void;
    inputDivData: any;
    processing: boolean;
    categories: any[];
}) {
    return (
        <FormContainer onSubmit={submit} processing={processing} className="p-6">
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">

                {/* Category + SKU */}
                <InputDiv
                    type="select"
                    label="Category"
                    name="product_category_id"
                    options={categories}
                    inputDivData={inputDivData}
                />
                <InputDiv
                    type="text"
                    label="SKU"
                    name="sku"
                    inputDivData={inputDivData}
                />

                {/* Title + Slug */}
                <InputDiv
                    type="text"
                    label="Title"
                    name="title"
                    inputDivData={inputDivData}
                />
                <InputDiv
                    type="text"
                    label="Slug"
                    name="slug"
                    inputDivData={inputDivData}
                />

                {/* Descriptions — full width */}
                <InputDiv
                    type="textarea"
                    label="Short Description"
                    name="short_description"
                    inputDivData={inputDivData}
                    className="md:col-span-2"
                />
                <InputDiv
                    type="editor"
                    label="Description (Overview)"
                    name="description"
                    inputDivData={inputDivData}
                    className="md:col-span-2"
                />
                <InputDiv
                    type="editor"
                    label="Long Description 2 (How It Works)"
                    name="long_description2"
                    inputDivData={inputDivData}
                    className="md:col-span-2"
                />
                <InputDiv
                    type="editor"
                    label="Long Description 3 (Why Choose Us)"
                    name="long_description3"
                    inputDivData={inputDivData}
                    className="md:col-span-2"
                />
                <InputDiv
                    type="tags"
                    label="Features (Key Features)"
                    name="features"
                    inputDivData={inputDivData}
                    placeholder="Add features and press Enter"
                    className="md:col-span-2"
                />

                {/* Pricing */}
                <InputDiv
                    type="number"
                    label="Selling Price"
                    name="price"
                    inputDivData={inputDivData}
                />
                <InputDiv
                    type="number"
                    label="MRP"
                    name="mrp"
                    inputDivData={inputDivData}
                />
                <InputDiv
                    type="number"
                    label="Original Price"
                    name="original_price"
                    inputDivData={inputDivData}
                />
                <InputDiv
                    type="number"
                    label="Distributor Price"
                    name="distributor_price"
                    inputDivData={inputDivData}
                />

                {/* GST */}
                <InputDiv
                    type="text"
                    label="HSN Code"
                    name="hsn_code"
                    inputDivData={inputDivData}
                    placeholder="e.g. 87089900"
                />
                <InputDiv
                    type="number"
                    label="GST Rate (%)"
                    name="gst_rate"
                    inputDivData={inputDivData}
                    placeholder="e.g. 18"
                />

                {/* All switches in one row */}
                <div className="md:col-span-2 flex flex-wrap gap-8">
                    <InputDiv
                        type="switch"
                        label="Manage Stock"
                        name="manage_stock"
                        inputDivData={inputDivData}
                        className="mb-0"
                    />
                    <InputDiv
                        type="switch"
                        label="Active"
                        name="is_active"
                        inputDivData={inputDivData}
                        className="mb-0"
                    />
                    <InputDiv
                        type="switch"
                        label="Featured"
                        name="is_featured"
                        inputDivData={inputDivData}
                        className="mb-0"
                    />
                </div>

                {/* Images — full width */}
                <InputDiv
                    type="images"
                    label="Images"
                    name="images"
                    inputDivData={inputDivData}
                    className="md:col-span-2"
                />

                {/* SEO */}
                <InputDiv
                    type="text"
                    label="Meta Title"
                    name="meta_title"
                    inputDivData={inputDivData}
                    className="md:col-span-2"
                />
                <InputDiv
                    type="textarea"
                    label="Meta Description"
                    name="meta_description"
                    inputDivData={inputDivData}
                    className="md:col-span-2"
                />
            </div>
        </FormContainer>
    );
}
