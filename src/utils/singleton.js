import { mockDeep, mockReset } from 'jest-mock-extended';
import prisma from './prisma.js';

jest.mock('./prisma.js', () => ({
  __esModule: true,
  default: mockDeep(),
}));

const prismaMock = prisma;

beforeEach(() => {
  mockReset(prismaMock);
});

export default prismaMock;