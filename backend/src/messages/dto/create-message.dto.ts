import { IsNotEmpty } from "class-validator";

export class CreateMessageDto {
  @IsNotEmpty()
  threadId: string;

  @IsNotEmpty()
  text: string;
}
