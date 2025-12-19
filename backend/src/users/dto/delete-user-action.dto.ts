export class DeleteUserActionDto {
  mode: 'delete' | 'transfer' | 'mixed';
  transferToUserId?: number;
  transferIds?: number[];
}
