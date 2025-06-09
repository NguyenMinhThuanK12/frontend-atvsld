import { CreationUserRequest } from "../dto/request/user/creationUserRequest";
import { UpdateUserRequest } from "../dto/request/user/updateUserRequest";
import { UserResponse } from "../dto/response/user/UserReponse";
import { User } from "../models/user.model";

export const mappingUserResponseToUser = (user: UserResponse): User => {
  return {
    id: user.id,
    username: user.username,
    password: user.password,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    jobTitle: user.jobTitle,
    roleId: user.roleId,
    businessId: user.businessId,
    userType: user.userType,
    birthday: user.birthday,
    gender: user.gender,
    province: user.province,
    district: user.district,
    ward: user.ward,
    address: user.address,
    avatar: user.avatar,
    isActive: user.is_active,
  };
};

export const mappingUserToCreationUserRequest = (
  user: User
): CreationUserRequest => {
  return {
    username: user.username,

    password: user.password,
    fullName: user.fullName,
    jobTitle: user.jobTitle,
    userType: user.userType,
    businessId: user.businessId,
    roleId: user.roleId,
    email: user.email,
    phoneNumber: user.phoneNumber,
    birthday: user.birthday,
    gender: user.gender,
    avatar: user.avatar,
    province: user.province || undefined,
    district: user.district || undefined,
    ward: user.ward || undefined,
    address: user.address || undefined,
  };
};

export const mappingUserToUpdateUserRequest = (
  user: User
): UpdateUserRequest => {
  console.log("Mapping User to UpdateUserRequest:", user);

  return {
    fullName: user.fullName,
    jobTitle: user.jobTitle,
    phoneNumber: user.phoneNumber,
    birthday: user.birthday,
    gender: user.gender,
    avatar: user.avatar,
    province: user.province || undefined,
    district: user.district || undefined,
    ward: user.ward || undefined,
    address: user.address || undefined,
    isActive: user.isActive,
  };
};
