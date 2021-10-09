import { IsNotEmpty } from 'class-validator';

export class UpdateMessageDto {
  @IsNotEmpty()
  text: string;
}
