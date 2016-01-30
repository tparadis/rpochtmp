#!/usr/bin/ruby -w

tab_mags = []
tab1 = [["a1",10],["a2",1],["a3",4],["a4",9],["a5",10]]
tab2 = [["b1",10],["b2",1],["b3",4],["b4",9],["b5",10]]
tab3 = [["c1",10],["c2",1],["c3",4],["c4",9],["c5",10]]
tab4 = [["d1",10],["d2",1],["d3",4],["d4",9],["d5",10]]
tab5 = [["e1",10],["e2",1],["e3",4],["e4",9],["e5",10]]
tab6 = [["e1",10],["e2",1],["e3",4],["e4",9],["e5",10]]
tab7 = [["e1",10],["e2",1],["e3",4],["e4",9],["e5",10]]
tab8 = [["e1",10],["e2",1],["e3",4],["e4",9],["e5",10]]
tab9 = [["e1",10],["e2",1],["e3",4],["e4",9],["e5",10]]
tab10 = [["e1",10],["e2",1],["e3",4],["e4",9],["e5",10]]
tab11 = [["e1",10],["e2",1],["e3",4],["e4",9],["e5",10]]
tab_mags << tab1
tab_mags << tab2
tab_mags << tab3
tab_mags << tab4
tab_mags << tab5
tab_mags << tab6
tab_mags << tab7
tab_mags << tab8
tab_mags << tab9
tab_mags << tab10
tab_mags << tab11

taille_max = 4
tab_indice = []
for indice in 0..(tab_mags.length() -1 )
	tab_indice << 0
end

tab_res = []
degrad = false
while(true)
for indice in (tab_indice.length() -1).downto(0)
	if indice == tab_indice.length()-1
		puts "première itération"
		if tab_indice[indice] == taille_max
			puts "taille max de la première itération"
			degrad = true
			tab_indice[indice] = 0
		else
			puts " incrémentation normale de la première itération"
			tab_indice[indice]+=1
		end
	else
		if degrad 
			puts "degrad true"
			if tab_indice[indice] == taille_max
				puts "et taille max"
				if indice == 0
					puts tab_res
					puts 'Fin !'
					exit
				end
				tab_indice[indice] = 0
			else
				puts "mais pas de taille max"
				tab_indice[indice]+=1
				degrad = false
			end
		end
	end
end
puts tab_indice
end
