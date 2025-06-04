"use client";
import { get } from 'lodash';
import { NextPage } from 'next'
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Profile from '../../components/UserFeature/Profile';

export const UserDetail: NextPage = () => {
    const pageType = useParams();
    const [id, setId] = useState<string>("");
    const isView = pageType?.pageType === "view";
    const isUpdate = pageType?.pageType === "update";
    const isCreate = pageType?.pageType === "create";
    const query = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const id = query.get("id");
        if (id) {
            setId(id);
        }
    }, [])

    useEffect(() => {
        if (isView || isUpdate) {
            getDetail(id);
        }
    }, [id])

    const getDetail = (id: string) => {
        // Logic to fetch user detail based on id
        // This could be an API call to get user data
        console.log(`Fetching details for user with id: ${id}`);
    }

    return (
      <div className="border-4 border-green-500 w-full h-full p-4 py-4 overflow-auto">
        {/* <Profile /> */}
      </div>
    );
}