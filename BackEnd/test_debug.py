import asyncio
import os
from fastapi import UploadFile
from fastapi.datastructures import Headers
from main import process_video

async def test():
    with open('dummy.mp4', 'wb') as f:
        f.write(b'dummy_data')
    
    with open('dummy.mp4', 'rb') as f:
        file = UploadFile(filename='dummy.mp4', file=f, headers=Headers({'content-type': 'video/mp4'}))
        try:
            res = await process_video(file)
            print("Success:", res)
        except Exception as e:
            import traceback
            traceback.print_exc()

asyncio.run(test())
