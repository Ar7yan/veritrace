from PIL import Image, ImageDraw
import os

os.makedirs('icons', exist_ok=True)

for size in [16, 48, 128]:
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d   = ImageDraw.Draw(img)
    d.rounded_rectangle(
        [0, 0, size-1, size-1],
        radius=size//4,
        fill=(232, 201, 126, 30),
        outline=(232, 201, 126, 180),
        width=max(1, size//16)
    )
    cx, cy, r = size//2, size//2, size//5
    d.ellipse(
        [cx-r, cy-r, cx+r, cy+r],
        outline=(232, 201, 126, 220),
        width=max(1, size//16)
    )
    img.save(f'icons/icon{size}.png')
    print(f'Created icon{size}.png')

print('All icons created!')