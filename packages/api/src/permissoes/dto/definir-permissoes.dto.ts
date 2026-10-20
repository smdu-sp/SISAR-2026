import { ArrayMaxSize, IsArray, IsString } from 'class-validator';

export class DefinirPermissoesDto {
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  recursos: string[];
}
