#!/bin/bash

# Titulo: crea_proyecto.sh
# Fecha: 21/11/2011
# Autor: Francisco David Charte
# Versión: 1.0
# Descripción: Prepara una jerarquía de directorios
#              adecuada en el directorio indicado, para
#              crear un proyecto.
#              En caso de existir un proyecto, actualiza el
#              archivo Makefile según los archivos de src/ 
#              y include/

[[ $# -gt 0 ]] && {
    NM="$1"
	PR_DIR="$2./$NM"
} || {
	PR_DIR="./"
	NM="`pwd | rev | cut -d"/" -f1 | rev`"
   echo "Se utilizará el directorio actual (proyecto $NM)."
}
	
[[ -d $PR_DIR ]] && {
   [[ -f $PR_DIR/Makefile ]] || {
      echo "El directorio $PR_DIR existe y no es un proyecto. Saliendo."
      exit 1;
   } && {
      printf "Proyecto existente en $PR_DIR. Actualizando...\n"
      
      LAST=`pwd`
      cd $PR_DIR/src/
      LSRC=`ls -1 *.cpp | rev | cut -d'.' -f2- | rev`
      cd $LAST
      MF="$PR_DIR/Makefile"
      
	   printf 'BIN=./bin\nDOC=./doc\nINCLUDE=./include\nLIB=./lib\nOBJ=./obj\nSRC=./src\n\n' > $MF &&
	   printf 'all:' >> $MF &&
	   for F in $LSRC; do
	      printf ' $(OBJ)/'"$F.o" >> $MF 
	   done
	   printf "\n" >> $MF
      echo "	g++ -o \$(BIN)/$NM $^" >> $MF &&
	   for F in $LSRC; do 
         echo '$(OBJ)/'"$F"'.o: $(SRC)/'"$F"'.cpp'" `[[ -f $PR_DIR/include/$F.h ]] && echo '$(INCLUDE)/'$F'.h'`" >> $MF &&
         echo '	g++ -o $(OBJ)/'"$F"'.o -c $< -I$(INCLUDE)' >> $MF
      done
      echo 'clean:' >> $MF &&
      echo '	rm $(OBJ)/*.o' >> $MF &&
      echo 'doc:' >> $MF &&
      echo '	doxygen $(DOC)/doxys/Doxyfile' >> $MF &&
      printf " [ OK ] Actualizado Makefile del proyecto\n"
   }
} || {
  	printf "Creando el proyecto $NM...\n"

   mkdir $PR_DIR && printf "  [ OK ]  Creado el directorio del proyecto\n"

   mkdir $PR_DIR/bin $PR_DIR/doc $PR_DIR/include $PR_DIR/lib $PR_DIR/obj $PR_DIR/src &&
   printf "  [ OK ]  Creada jerarquía de directorios\n"

   # Creamos los archivos por defecto
   touch $PR_DIR/src/main.cpp &&
   printf "using namespace std;\n\nint main(int argc, char *argv[]){\n\t\n}" > $PR_DIR/src/main.cpp &&
   printf "  [ OK ]  Creado archivo main.cpp\n"

   # Creamos el Makefile por defecto
   MF="$PR_DIR/Makefile" &&
   touch $MF

   printf 'BIN=./bin\nDOC=./doc\nINCLUDE=./include\nLIB=./lib\nOBJ=./obj\nSRC=./src\n\n' > $MF &&
   echo 'all: $(OBJ)/main.o' >> $MF &&
   echo "	g++ -o \$(BIN)/$NM $^" >> $MF &&
   echo '$(OBJ)/main.o: $(SRC)/main.cpp' >> $MF &&
   echo '	g++ -o $(OBJ)/main.o -c $^ -I$(INCLUDE)' >> $MF &&
   echo 'clean:' >> $MF &&
   echo '	rm $(OBJ)/*.o' >> $MF &&
   echo 'doc:' >> $MF &&
   echo '	doxygen $(DOC)/doxys/Doxyfile' >> $MF &&
   printf "  [ OK ]  Creado archivo Makefile\n"
}