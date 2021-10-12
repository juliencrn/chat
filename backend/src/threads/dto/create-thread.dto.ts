import { IsNotEmpty } from "class-validator";

export class CreateThreadDto {
  @IsNotEmpty()
  name: string;
}
