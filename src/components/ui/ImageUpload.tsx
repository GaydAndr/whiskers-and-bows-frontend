"use client";

import React, { useState } from 'react';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { IconUpload, IconTrash, IconPhoto, IconStar, IconGridDots } from '@tabler/icons-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useNotification } from '@/context/NotificationContext';
import { useConfirmation } from '@/context/ConfirmationContext';
import { productService } from '@/services/productService';
import { API_BASE_URL } from '@/config/api';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export default function ImageUpload({ value, onChange, error }: ImageUploadProps) {
  const { notify } = useNotification();
  const { confirm } = useConfirmation();
  const [uploading, setUploading] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  const onUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info !== 'string' && result.info.secure_url) {
      onChange([...value, result.info.secure_url]);
    }
  };

  const handleMakeMain = (indexToPromote: number) => {
    const newValue = [...value];
    const [item] = newValue.splice(indexToPromote, 1);
    newValue.unshift(item);
    onChange(newValue);
  };

  const handleRemove = async (urlToRemove: string) => {
    const shouldDelete = await confirm({
      title: 'Видалення фото',
      message: 'Ви дійсно хочете видалити це фото?',
      confirmText: 'Видалити',
      cancelText: 'Скасувати'
    });
    if (!shouldDelete) return;

    setDeletingUrl(urlToRemove);
    try {
      // Call backend API to delete from Cloudinary
      const response = await fetch(`${API_BASE_URL}/images/single`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToRemove }),
      });

      if (response.ok) {
        onChange(value.filter((url) => url !== urlToRemove));
        notify('Фото видалено', 'success');
      } else {
        notify('Помилка при видаленні фото з хмари', 'error');
      }
    } catch (err) {
      console.error(err);
      notify('Помилка мережі при видаленні фото', 'error');
    } finally {
      setDeletingUrl(null);
    }
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(value);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onChange(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">Фотографії товару</label>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
      
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={(result) => {
          onUpload(result);
          setUploading(false);
        }}
        onError={() => setUploading(false)}
        onClose={() => setUploading(false)}
        options={{
          multiple: true,
          resourceType: "image",
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => { setUploading(true); open(); }}
            disabled={uploading}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {uploading ? 'Завантаження...' : <><IconUpload size={20} /> Завантажити фото</>}
          </button>
        )}
      </CldUploadWidget>

      {value.length > 0 ? (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
             {(provided: any) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-wrap gap-3"
              >
                {value.map((url, index) => (
                    <Draggable key={`img-${index}`} draggableId={`img-${index}`} index={index}>
                     {(provided: any, snapshot: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          width: '120px',
                          position: 'relative',
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.8 : 1,
                        }}
                      >
                        <div className={`relative rounded-xl overflow-hidden border-2 ${index === 0 ? 'border-indigo-500' : 'border-gray-200'}`}>
                          <img src={url} alt="product" className="w-full h-24 object-cover pointer-events-none" />
                          {index === 0 && (
                            <div className="absolute top-1 left-1 bg-indigo-500 text-white text-[8px] px-1 rounded font-bold uppercase">
                              Головне
                            </div>
                          )}
                          <div className="absolute bottom-1 right-1 flex gap-1">
                            {index !== 0 && (
                              <button 
                                type="button"
                                onClick={() => handleMakeMain(index)}
                                className="p-1 bg-white/80 rounded-full text-indigo-600 hover:bg-white transition-colors cursor-pointer"
                                title="Зробити головним"
                              >
                                <IconStar size={12} />
                              </button>
                            )}
                            <button 
                              type="button"
                              onClick={() => handleRemove(url)}
                              disabled={deletingUrl === url}
                              className="p-1 bg-white/80 rounded-full text-red-600 hover:bg-white transition-colors cursor-pointer"
                              title="Видалити"
                            >
                              {deletingUrl === url ? '...' : <IconTrash size={12} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
          <IconPhoto size={32} />
          <span className="text-sm mt-2">Фото відсутні</span>
        </div>
      )}
    </div>
  );
}
