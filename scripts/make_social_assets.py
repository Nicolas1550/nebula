"""Generate static planet previews and a social sharing banner from project's maps.
Dependency for regeneration: Pillow + NumPy. Generated images ship in the ZIP.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
SPACE=ROOT/'public'/'space'
SOCIAL=ROOT/'public'/'social'
SOCIAL.mkdir(exist_ok=True,parents=True)
N=430
accent={'origin':(86,193,255),'nexus':(178,115,255),'inferno':(255,132,70)}
rot={'origin':.24,'nexus':2.35,'inferno':1.15}
planets={}
for name in ('origin','nexus','inferno'):
    src=np.asarray(Image.open(SPACE/f'{name}-color-2k.webp').convert('RGB'))
    ys,xs=np.mgrid[:N,:N]
    u=(xs+0.5-N/2)/(N*.42)
    v=(N/2-ys-0.5)/(N*.42)
    rad=u*u+v*v
    sphere=rad<=1
    z=np.sqrt(np.clip(1-rad,0,1))
    lon=np.arctan2(u,z)+rot[name]
    lat=np.arcsin(np.clip(v,-1,1))
    ix=(np.mod(lon/(2*np.pi)+.5,1)*(src.shape[1]-1)).astype(np.int32)
    iy=(np.clip(.5-lat/np.pi,0,1)*(src.shape[0]-1)).astype(np.int32)
    light=np.maximum(0, u*(-.45)+v*(.29)+z*(.7))
    lambert=.16+.84*(light**1.25)
    rgb=(src[iy,ix,:].astype(np.float32)*lambert[...,None]).clip(0,255).astype('uint8')
    rgba=np.zeros((N,N,4),dtype=np.uint8)
    rgba[...,:3]=rgb; rgba[...,3]=np.where(sphere,255,0)
    im=Image.fromarray(rgba,'RGBA')
    aa=Image.new('RGBA',(N,N),(0,0,0,0))
    d=ImageDraw.Draw(aa)
    radius=int(N*.42)
    col=accent[name]
    d.ellipse((N/2-radius,N/2-radius,N/2+radius,N/2+radius),outline=(*col,180),width=7)
    blur=aa.filter(ImageFilter.GaussianBlur(18))
    out=Image.alpha_composite(blur,im)
    out=Image.alpha_composite(out,aa)
    out.save(SOCIAL/f'{name}-preview.webp','WEBP',quality=88,method=6)
    planets[name]=out

W,H=1200,630
nebula=Image.open(SPACE/'nebula-balanced.webp').convert('RGB')
scale=max(W/nebula.width,H/nebula.height)
nebula=nebula.resize((round(nebula.width*scale),round(nebula.height*scale)),Image.Resampling.LANCZOS)
left=(nebula.width-W)//2; top=(nebula.height-H)//2
bg=nebula.crop((left,top,left+W,top+H)).convert('RGBA')
arr=np.array(bg).astype(np.float32)
y,x=np.mgrid[:H,:W]
# Keep the title readable while adding a bright deep-space area at right.
dim=.28+.55*np.clip((x-210)/900,0,1)
arr[...,:3]=(arr[...,:3]*dim[...,None]).clip(0,255)
bg=Image.fromarray(arr.astype(np.uint8),'RGBA')
for name,pos,size in [('origin',(670,325),315),('nexus',(860,295),455),('inferno',(1095,380),300)]:
    pic=planets[name].resize((size,size),Image.Resampling.LANCZOS)
    bg.alpha_composite(pic,(round(pos[0]-size/2),round(pos[1]-size/2)))
canvas=Image.new('RGBA',(W,H),(0,0,0,0))
d=ImageDraw.Draw(canvas)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
regular='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
name_font=ImageFont.truetype(font,80)
tag_font=ImageFont.truetype(font,21)
body_font=ImageFont.truetype(regular,24)
small_font=ImageFont.truetype(font,13)
d.rectangle((57,65,62,156),fill=(124,205,255,255))
d.text((84,66),'NEBULA',font=name_font,fill=(239,250,255,255))
d.text((84,169),'BEYOND THE KNOWN',font=tag_font,fill=(134,206,255,255))
d.line((62,227,513,227),fill=(104,181,242,140),width=2)
d.text((62,272),'TRES MUNDOS.',font=ImageFont.truetype(font,31),fill=(255,255,255,255))
d.text((62,316),'UNA EXPERIENCIA.',font=ImageFont.truetype(font,28),fill=(186,220,255,255))
d.text((64,391),'Portfolio interactivo · 3D · React',font=body_font,fill=(199,215,236,255))
d.text((64,559),'NICOLÁS LUCIUK  /  FULL STACK DEVELOPER',font=small_font,fill=(175,204,236,255))
d.rounded_rectangle((64,469,332,524),radius=5,outline=(133,203,255,210),width=2,fill=(15,35,66,230))
d.text((84,488),'EXPLORAR EL UNIVERSO',font=small_font,fill=(216,242,255,255))
bg=Image.alpha_composite(bg,canvas)
bg.convert('RGB').save(SOCIAL/'nebula-v8-cover.jpg',quality=87,optimize=True,subsampling=0)
print('Assets creados:',[f.name for f in SOCIAL.iterdir()])
