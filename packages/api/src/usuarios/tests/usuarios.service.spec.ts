import { UsuariosService } from '../usuarios.service';
import { PrismaService } from '../../config/prisma';
import { AppService } from '../../app.service';
import { SGUService } from '../../sgu/sgu.service';

describe('Usuarios.service tests', () => {
	let service: UsuariosService;
	let prisma: PrismaService;
	let app: AppService;
	let sgu: SGUService;

	const MockPrismaService = {
		usuario: {
			create: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
			findMany: jest.fn(),
			findUnique: jest.fn(),
		},
	};

	beforeEach(() => {
		// Mesmos mocks do teste original (o original injetava MockPrismaService nos três).
		prisma = MockPrismaService as unknown as PrismaService;
		app = MockPrismaService as unknown as AppService;
		sgu = MockPrismaService as unknown as SGUService;
		service = new UsuariosService(prisma, sgu, app);
	});

	it('os serviços deverão estar definidos', () => {
		expect(service).toBeDefined();
		expect(prisma).toBeDefined();
		expect(app).toBeDefined();
		expect(sgu).toBeDefined();
	});
});
