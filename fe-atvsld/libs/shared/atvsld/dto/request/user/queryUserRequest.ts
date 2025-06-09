export interface QueryUserRequest {
    username?: string;
    fullName?: string;
    jobTitle?: string;
    
    userType?: string;
    businessId?: string;
    roleId?: string;

    isActive?: string;
}