import type { Product } from '../../domain/types'

export const mockProducts: Product[] = [
  {
    id: 'oak-lounge-chair',
    name: 'Oak Lounge Chair',
    description:
      'A Scandinavian-style lounge chair with walnut arms and soft charcoal fabric.',
    price: 379,
    imageUrl:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    purchaseUrl: 'https://example.com/products/oak-lounge-chair',
    modelUrl: '',
    materialHint: 'Solid oak + linen blend',
    dimensions: '72cm x 78cm x 88cm',
    cameraPresets: {
      front: [3.8, 2.2, 3.8],
      side: [5.2, 1.8, 0],
      top: [0.2, 6.2, 0.2],
    },
  },
  {
    id: 'horizon-sofa',
    name: 'Horizon 3-Seater Sofa',
    description:
      'Low-profile modular sofa designed for open-plan interiors and comfortable hosting.',
    price: 1149,
    imageUrl:
      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=900&q=80',
    purchaseUrl: 'https://example.com/products/horizon-sofa',
    modelUrl: '',
    materialHint: 'Powder-coated steel + performance velvet',
    dimensions: '210cm x 96cm x 83cm',
    cameraPresets: {
      front: [4.4, 2.5, 4.4],
      side: [6.2, 2.1, 0],
      top: [0.3, 7.2, 0.3],
    },
  },
  {
    id: 'aurora-coffee-table',
    name: 'Aurora Coffee Table',
    description:
      'Rounded tempered glass coffee table with a matte black support frame.',
    price: 289,
    imageUrl:
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=900&q=80',
    purchaseUrl: 'https://example.com/products/aurora-coffee-table',
    modelUrl: '',
    materialHint: 'Tempered glass + steel',
    dimensions: '110cm x 60cm x 42cm',
    cameraPresets: {
      front: [3.4, 1.9, 3.4],
      side: [4.2, 1.6, 0],
      top: [0.2, 5.2, 0.2],
    },
  },
]

