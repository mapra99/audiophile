require 'rails_helper'

RSpec.describe Admin::V1::Products::Creator do
  subject(:creator) { described_class.new(params: params) }

  let(:product_category) { create(:product_category) }
  let(:category_id) { product_category.id }
  let(:params) do
    {
      name: 'Some Product',
      price: 450,
      featured: false,
      category_id: category_id,
      image: fixture_file_upload('product_image.png', 'image/png')
    }
  end

  describe '#call' do
    subject(:result) { creator.call }

    it 'succeeds' do
      expect(result.success?).to eq(true)
    end

    it 'creates a new product' do
      expect { creator.call }.to change(Product, :count).by(1)
    end

    describe 'the new product' do
      let(:new_product) { creator.product }

      before do
        creator.call
      end

      it 'has a name set by the params' do
        expect(new_product.name).to eq(params[:name])
      end

      it 'has a price set by the params' do
        expect(new_product.base_price).to eq(params[:price])
      end

      it 'is featured per the params' do
        expect(new_product.featured).to eq(params[:featured])
      end

      it 'has a category id per the params' do
        expect(new_product.product_category.id).to eq(params[:category_id])
      end

      it 'has a image attached' do
        expect(new_product.image.attached?).to eq(true)
      end
    end

    describe 'when there is already an existing product name' do
      before do
        create(:product, name: params[:name])
      end

      it 'does not create a new product' do
        expect { creator.call }.not_to change(Product, :count)
      end

      it 'returns a failure' do
        expect(result.failure?).to eq(true)
      end

      it 'returns the right error code' do
        expect(result.failure[:code]).to eq(:invalid_product)
      end
    end

    describe "when category is't found" do
      let(:category_id) { 'something' }

      it 'returns a failure' do
        expect(result.failure?).to eq(true)
      end

      it 'returns the right error code' do
        expect(result.failure[:code]).to eq(:category_not_found)
      end
    end

    describe 'when service failes due to unhandled error' do
      before do
        allow(Product).to receive(:new).and_raise(StandardError, 'ERROR MESSAGE')
      end

      it 'returns a failure' do
        expect(result.failure?).to eq(true)
      end

      it 'returns internal_error as failure code' do
        expect(result.failure[:code]).to eq(:internal_error)
      end
    end

    describe 'when product could not be saved' do
      # rubocop:disable RSpec/AnyInstance
      before do
        allow_any_instance_of(Product).to receive(:save!).and_raise(ActiveRecord::RecordNotSaved)
      end
      # rubocop:enable RSpec/AnyInstance

      it 'returns a failure' do
        expect(result.failure?).to eq(true)
      end

      it 'returns the right error code' do
        expect(result.failure[:code]).to eq(:product_not_saved)
      end
    end
  end
end
