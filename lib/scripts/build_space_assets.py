"""Original, self-contained NEBULA V6 procedural planet and galaxy textures.
Requires numpy, opencv-python and Pillow. Generated art is sci-fi, not satellite data.
"""
from pathlib import Path
import gc
import numpy as np
import cv2
from PIL import Image
D=Path(__file__).resolve().parents[1]/'public'/'space'; D.mkdir(exist_ok=True,parents=True)
W,H=4096,2048

def noise(w,h,seed,octaves=((5,1),(12,.6),(26,.34),(55,.2),(115,.12),(250,.07),(515,.035))):
    rng=np.random.default_rng(seed);out=np.zeros((h,w),np.float32)
    for nx,amp in octaves:
        ny=max(3,round(nx*h/w));g=rng.standard_normal((ny,nx)).astype('float32')
        padded=np.concatenate([g[:,-2:],g,g[:,:2]],axis=1)
        extra=round(w*2/nx); up=cv2.resize(padded,(w+4*extra,h),interpolation=cv2.INTER_CUBIC)
        out+=amp*up[:,2*extra:2*extra+w]
    return out

def smooth(a,b,v):
    t=np.clip((v-a)/(b-a),0,1);return t*t*(3-2*t)

def norm(a):
    q0,q1=np.percentile(a,[1,99]);return np.clip((a-q0)/(q1-q0),0,1)

def save(name,a,q=88,wh=None):
    a=np.uint8(np.clip(a,0,255))
    if wh is not None:a=cv2.resize(a,wh,interpolation=cv2.INTER_AREA)
    mode='L' if a.ndim==2 else ('RGBA' if a.shape[-1]==4 else 'RGB')
    Image.fromarray(a,mode).save(D/name,quality=q,method=3)
    print(name,round((D/name).stat().st_size/1048576,2),'MB',flush=True)

def normals(height):
    dx=np.roll(height,1,axis=1)-np.roll(height,-1,axis=1)
    dy=np.roll(height,1,axis=0)-np.roll(height,-1,axis=0)
    dx=np.clip(dx*5,-2,2);dy=np.clip(dy*5,-2,2)
    z=1/np.sqrt(1+dx*dx+dy*dy)
    a=np.stack([(dx*z*.5+.5)*255,(dy*z*.5+.5)*255,(z*.5+.5)*255],-1)
    return np.uint8(a)

def craters(a,seed,count):
    rng=np.random.default_rng(seed);h,w=a.shape
    for _ in range(count):
        r=rng.uniform(6,95)*(rng.random()**1.1+.25)
        cx=int(rng.uniform(0,w));cy=int(rng.uniform(.04*h,.96*h));rx=int(r*1.5)
        ys=np.arange(max(0,cy-rx),min(h,cy+rx+1));xs=np.arange(cx-rx,cx+rx+1)
        if len(xs)==0 or len(ys)==0:continue
        radius=np.sqrt((xs[None,:]-cx)**2+(ys[:,None]-cy)**2)/r
        pit=-.18*np.maximum(0,1-radius**2)**2
        rim=.13*np.exp(-((radius-.90)/.14)**2)
        a[np.ix_(ys,xs%w)]+=(pit+rim).astype('float32')
    return a

def mixpalette(t, stops, colors):
    return np.stack([np.interp(t.reshape(-1),stops,[v[k] for v in colors]).reshape(t.shape) for k in range(3)],-1)

def planet(name,seed):
    print('Planet:',name,flush=True)
    a=noise(W,H,seed);b=noise(W,H,seed+71,((37,.7),(85,.42),(179,.20),(356,.11),(710,.06)))
    if name=='origin':
        low=a*.85+noise(W,H,seed+5,((4,.55),(12,.27),(25,.13)))
        land=smooth(-.15,.11,low);elev=np.clip(np.maximum(0,low+.1)*.72+(np.abs(a+b*.4)*.38+b*.14)*land,0,1)
        oceans=np.clip((-low+.10)*3.1,0,1)
        sea=np.stack((.013+.058*(1-oceans),.045+.18*(1-oceans),.13+.20*(1-oceans)),-1)
        green=np.stack((.11+b*.042,.22+b*.04,.12+b*.035),-1)
        mountain=smooth(.48,.9,norm(elev))[:,:,None]
        rock=np.stack((.34+b*.045,.33+b*.052,.28+b*.04),-1)
        surface=green*(1-mountain)+rock*mountain
        latitude=np.abs(np.linspace(-1,1,H,dtype='float32'))[:,None]
        snow=np.maximum(smooth(.78,.95,norm(elev)),np.broadcast_to(smooth(.80,.96,latitude),(H,W)))[:,:,None]*land[:,:,None]
        surface=surface*(1-snow)+np.array([.88,.92,.96])*snow
        color=surface*land[:,:,None]+sea*(1-land[:,:,None])
        rough=np.clip(.13*(1-land)+(.70+b*.12)*land,.07,.96)
        height=elev
    elif name=='nexus':
        height=norm(craters(a*.39+b*.14+abs(a)*.17,seed+9,850))
        veins=1-smooth(.035,.13,abs(a*.69+b*.3))
        tone=np.clip(.14+.77*height+b*.09,0,1)
        color=mixpalette(tone,[0,.24,.49,.7,1],[(.045,.042,.07),(.14,.12,.22),(.30,.26,.41),(.47,.41,.58),(.70,.64,.77)])
        color=color*(1-veins[:,:,None]*.24)
        rough=np.clip(.84+b*.11,.68,.99)
        emission=np.stack((veins*.22,veins*.07,veins*.67),-1)*np.clip((veins-.43)*1.6,0,1)[:,:,None]
    else:
        height=norm(craters(a*.32+b*.23+abs(a)*.22,seed+3,650))
        fracture=1-smooth(.023,.12,abs(a*.77+b*.25))
        tone=np.clip(.15+.74*height+b*.08,0,1)
        color=mixpalette(tone,[0,.24,.5,.77,1],[(.025,.02,.026),(.09,.06,.06),(.20,.12,.11),(.34,.20,.15),(.48,.33,.27)])
        color=color*(1-fracture[:,:,None]*.58)
        rough=np.clip(.87+b*.10,.7,1)
        glow=np.clip((fracture-.42)*1.75,0,1)
        emission=np.stack((glow*.96,glow*.21,glow*.018),-1)
    color=np.clip(color+b[:,:,None]*.024,0,1)
    save(f'{name}-color-4k.webp',color*255,92)
    save(f'{name}-color-2k.webp',color*255,88,(2048,1024))
    save(f'{name}-height-4k.webp',height*255,90)
    save(f'{name}-height-2k.webp',height*255,85,(2048,1024))
    nn=normals(height)
    save(f'{name}-normal-4k.webp',nn,89)
    save(f'{name}-normal-2k.webp',nn,85,(2048,1024))
    save(f'{name}-roughness-2k.webp',rough*255,85,(2048,1024))
    if name=='origin':
        cloudy=noise(W,H,seed+177,((8,.55),(17,.4),(36,.28),(80,.16),(170,.08),(320,.04)))
        rgba=np.empty((H,W,4),np.uint8)
        rgba[:,:,:3]=245
        rgba[:,:,3]=np.uint8(np.clip(cloudy-.03,0,1)**1.3*225)
        save('origin-clouds-4k.webp',rgba,90)
        save('origin-clouds-2k.webp',rgba,87,(2048,1024))
    else:
        save(f'{name}-emissive-4k.webp',emission*255,90)
        save(f'{name}-emissive-2k.webp',emission*255,86,(2048,1024))
    del a,b,color,height,rough,nn;gc.collect()

def galaxy(seed,name,palette):
    print('Galaxy',name,flush=True)
    rng=np.random.default_rng(seed); n=1536;N=350000
    arms=rng.integers(0,4,size=N);rad=rng.power(1.3,N)*.88+.01
    ang=arms*np.pi/2+3.0*np.log(rad+.25)+rng.normal(0,.17,N)
    x=(n*(.50+rad*.42*np.cos(ang))).astype('int32')
    y=(n*(.50+rad*.24*np.sin(ang))).astype('int32')
    x=np.clip(x,0,n-1);y=np.clip(y,0,n-1)
    dots=np.zeros((n,n),np.float32)
    np.add.at(dots,(y,x),rng.uniform(.2,1,N)*(1-rad))
    near=cv2.GaussianBlur(dots,(0,0),1.1)
    soft=cv2.GaussianBlur(dots,(0,0),9)
    haze=cv2.GaussianBlur(dots,(0,0),48)
    yy,xx=np.ogrid[:n,:n]
    core=np.exp(-(((xx-n*.50)/(n*.08))**2+((yy-n*.50)/(n*.055))**2)*.9)
    signal=np.maximum(near*.44+soft*.93+haze*2.2+core*1.4,0)
    signal=signal/(signal+.54)
    rgb=signal[:,:,None]*np.array(palette,dtype=np.float32)[None,None,:]*1.6
    rgb+=core[:,:,None]*np.array([.48,.35,.24])[None,None,:]
    rgba=np.concatenate([np.clip(rgb,0,1),np.clip(signal*.94,0,1)[:,:,None]],-1)
    locs=rng.choice(N,size=2400,replace=False)
    rgba[y[locs],x[locs],:3]=1; rgba[y[locs],x[locs],3]=1
    save(name,rgba*255,93)

def nebula():
    print('Deep sky',flush=True)
    w,h=4096,2304
    a=noise(w,h,777,((5,.8),(12,.5),(24,.29),(57,.13),(117,.075)))
    b=noise(w,h,111,((6,.76),(13,.4),(27,.27),(63,.13)))
    warm=np.maximum(a+.08,0);cold=np.maximum(b+.09,0)
    rgb=np.zeros((h,w,3),dtype=np.float32);rgb[:]=[1.6,3,10]
    rgb+=warm[:,:,None]*[31,13,58];rgb+=cold[:,:,None]*[10,27,60]
    rng=np.random.default_rng(22);x=rng.integers(0,w,size=10000);y=rng.integers(0,h,size=10000)
    br=rng.uniform(65,225,len(x));rgb[y,x]=np.stack([br*.84,br*.91,br],-1)
    save('nebula-deep-4k.webp',rgb,90)

def ring():
    n=2048;y,x=np.ogrid[:n,:n];r=np.sqrt(((x-n/2)/(n/2))**2+((y-n/2)/(n/2))**2)
    p=np.sin(r*450)*.2+np.sin(r*1180)*.11+np.cos(r*97)*.14
    alpha=np.clip(.73+p,0,1)*(r>.52)*(r<.975)*(np.sin(r*101)>-.85)
    alpha*=np.clip((r-.51)*27,0,1)*np.clip((.99-r)*31,0,1)
    rgba=np.empty((n,n,4),np.uint8)
    rgba[:,:,0]=np.uint8(np.clip(170+p*100,0,255));rgba[:,:,1]=np.uint8(np.clip(141+p*86,0,255));rgba[:,:,2]=np.uint8(np.clip(204+p*75,0,255));rgba[:,:,3]=np.uint8(alpha*230)
    save('nexus-rings-2k.webp',rgba,94)

if __name__=='__main__':
    for name,seed in [('origin',432),('nexus',718),('inferno',1051)]:planet(name,seed)
    galaxy(19,'galaxy-violet.webp',[.80,.54,1.0]);galaxy(29,'galaxy-blue.webp',[.43,.77,1.0]);nebula();ring();print('Done',flush=True)
