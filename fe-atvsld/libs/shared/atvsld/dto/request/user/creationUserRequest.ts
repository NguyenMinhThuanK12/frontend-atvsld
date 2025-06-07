import { Gender } from "@/libs/shared/core/enums/gender";
import { UserType } from "@/libs/shared/core/enums/userType";

export interface CreationUserRequest {
    id: string;
    account: string;
    password: string;
    full_name: string;
    job_title: string;
    user_type?: UserType;
    business: { id: string; name: string } | null;
    role: { id: string; name: string } | null;
    email: string;
    
    birthday?: Date;
    gender?: Gender;
    phone?: string;
    
    is_active: boolean;
    avatar: File | null;
    
    province?: string;
    district?: string;
    ward?: string;
    address?: string;
}