import { Controller, Get, Post, UseInterceptors, UploadedFiles, Body } from '@nestjs/common';
import { diskStorage } from 'multer';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

export const imageFileFilter = (req, file, callback) => {
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		return callback(new Error('Only image files are allowed!'), false);
	}
	callback(null, true);
};
export const editFileName = (req, file, callback) => {
	const name = file.originalname.split('.')[0];
	const fileExtName = extname(file.originalname);
	const randomName = Array(4)
		.fill(null)
		.map(() => Math.round(Math.random() * 16).toString(16))
		.join('');
	callback(null, `${name}-${randomName}${fileExtName}`);
};

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@Post('upload')
	@UseInterceptors(
		FilesInterceptor('file[]', 20, {
			storage: diskStorage({
				destination: './uploads',
				filename: editFileName,
			}),
			fileFilter: imageFileFilter,
		}),
	)
	async uploadMultipleFiles(@UploadedFiles() files, @Body() body: any) {
		const response = [];
		files.forEach(file => {
			const fileReponse = {
				originalname: file.originalname,
				filename: file.filename,
			};
			response.push(fileReponse);
		});
		return response;
	}

}
