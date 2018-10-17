export interface Context {
  db: any
}

export interface AddMemberPayload {
  newUserId: string
  existingUserrInviteSent: boolean
}
