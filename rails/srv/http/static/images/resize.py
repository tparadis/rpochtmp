#!/usr/bin/python2
import glob
import PIL
from PIL import Image
import os

MAXSIZE = 500000 #Limite de taille avant de considerer qu'il faut redimensionner l'image
NB = 0
tailleTotale = 0
tailleApresModif = 0
baseW = 1000 #La largeur de base pour la nouvelle image
print "Outils de redimension d'image :"
filetypes = ('*.jpg', '*.JPG', '*.png', '*.PNG') 
images = []
for files in filetypes:
	images.extend(glob.glob(files))
for img in images:
	taille = os.stat(img).st_size
	tailleTotale += taille
	if taille > MAXSIZE:
		im = Image.open(img, "r")
		ratio = float(im.size[0]) / im.size[1]

		newH = int(round(baseW / ratio))

		im = im.resize((baseW, newH), PIL.Image.ANTIALIAS)
		im.save(img)

		NB = NB + 1
	
print str(NB) + " / " +str(len(images))
apres = glob.glob('*.jpg')
for img in images:
	tailleApresModif += os.stat(img).st_size
print "% gagne : " + str(float((tailleTotale - tailleApresModif))/tailleTotale * 100)


