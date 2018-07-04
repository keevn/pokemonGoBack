package comp354.team9.util;

public class Utility {

    static public int[] covertStringToArray(String deckSting) {
        String[] strArray = deckSting.split(",");
        int[] intArray = new int[strArray.length];
        for (int i = 0; i < strArray.length; i++) {
            intArray[i] = Integer.parseInt(strArray[i]);
        }
        return intArray;
    }
}
