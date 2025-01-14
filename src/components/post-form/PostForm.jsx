import React, { useCallback, useEffect } from 'react'
import {useForm} from 'react-hook-form'
import {Button, Input, RTE, Select} from '../index'
import appwriteService from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function PostForm ({post}) {
    
    const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues:{
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active"
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData)

    const submit = async (data) => {
        if(post){//if post present
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if(file){//if file exits
                appwriteService.deleteFile(post.featuredImage)//deleting previous image and updating with new
            }

            const dbPost = await appwriteService.updatePost(post.$id,{
            ...data,
            featuredImage: file ? file.$id : undefined
            })//for uploading file 

//dbPost will contain the updated post's data if the backend successfully processes the update request.The if statement checks if dbPost exists, meaning the update was successful.

            if(dbPost){
                navigate(`/post/${dbPost.$id}`)
            } 
        } else{
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if(file){//if file present (necessary)
                const fileId = file.$id
                data.featuredImage = fileId
                const dbPost = await appwriteService.createPost({
                    ...data,
                    userId: userData.$id,
                })//here we are spreading values and giving (always keep an eye)
                if(dbPost){
                    navigate(`/post/${dbPost.$id}`)
                }

            }
        }
    }

    const slugTransform = useCallback((value) => {
        if(value && typeof value == 'string'){
        return value
            .trim()
            .toLowerCase()
            .replace(/^[a-zA-Z\d\s]/g,'-')
            .replace(/\s/g,'-')
        }
        return ''
    },[])
    
    //using  useCallback so that effciently it is called as it is cache

    useEffect(() => {
        const subscription = watch((value, {name}) => {
            if(name === 'title'){
                setValue("slug", slugTransform(value.title, {shouldValidate: true}))
            }
        })

        return () => subscription.unsubscribe()
        
    },[watch, slugTransform,setValue])


    return (
        <form onSubmit={handleSubmit(submit)} className='flex flex-wrap' >
            <div className='w-2/3 px-2'> {/*input: title, slug (both are imported Input.jsx) RTE */}
                <Input
                    label = 'Title :'
                    placeholder = "Title"
                    className = 'mb-4'
                    {...register('tile',{required: true})}
                />
                <Input
                    label = 'Slug :'
                    placeholder = "Slug"
                    className = 'mb-4'
                    {...register('slug',{required: true})}

                    //here using onInput since it is effecient than onChange

                    onInput = {(e) => {
                        setValue('slug',slugTransform(e.currentTarget.value),{shouldValidate: true});
                    }}//important
                />

                <RTE label='Content :' name='content' control={control} defaultValue={getValues('content')} />

            </div>
            <div className='w-1/3 px-2'>
                <Input
                    label = 'Featured Image :'
                    type = 'file'
                    className = 'mb-4'
                    accept = 'image/png, image/jpg, image/jpeg, image/gif'
                    {...register('image',{required: !post})}
                />
                {post && (
                    <div className='w-full mb-4'>
                        <img 
                            src={appwriteService.getFilePreview(post.featuredImage)} 
                            alt={post.title}
                            className='rounded-lg'
                        />
                    </div>
                )}

                <Select
                    options={['active','inactive']}
                    label = 'Status'
                    className = 'mb-4'
                    {...register('status',{required: true})}
                />

                <Button 
                    type = 'submit'
                    bgColor = {post ? 'bg-green-500' : undefined} 
                    className = 'w-full'
                >
                    {post ? 'Update' : 'Submit'}
                </Button>
            </div>
        </form>
    )
}
