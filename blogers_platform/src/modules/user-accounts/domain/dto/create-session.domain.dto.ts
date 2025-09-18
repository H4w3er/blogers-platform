export class CreateSessionDomainDto {
  ip: string;
  title: string;
  deviceId: string;
  userId: string;
}

export class DeleteSessionDomainDto {
  deviceId: string;
  userId: string;
}
//TODO ip-"x-forwarded-from" and title-"user-agent"