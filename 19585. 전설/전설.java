import java.io.*;
import java.util.*;
import static java.lang.Math.*;

public class Main {

    private int totalColors, totalNicknames;

    private final Trie colorTrieRoot = new Trie('S', false);
    private final Set<String> nicknameSet = new HashSet<>();

    public static void main(String[] args) {
        (new Main()).solve();
    }

    private void solve() {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(System.in))) {
            String[] input = br.readLine().split(" ");
            this.totalColors = Integer.parseInt(input[0]);
            this.totalNicknames = Integer.parseInt(input[1]);
            this.readColors(br);
            this.readNicknames(br);
            System.out.print(this.evaluateTeams(br));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void readColors(BufferedReader br) throws IOException {
        for (int i = 0; i < totalColors; i++) {
            String color = br.readLine();
            this.addStringToTrie(color, this.colorTrieRoot);
        }
    }

    private void readNicknames(BufferedReader br) throws IOException {
        for (int i = 0; i < totalNicknames; i++) {
            String nickname = br.readLine();
            this.nicknameSet.add(nickname);
        }
    }

    private void addStringToTrie(String string, Trie root) {
        Trie cursor = root;
        for (int i = 0; i < string.length(); i++) {
            Trie newTrie = new Trie(string.charAt(i), (i == string.length() - 1));
            cursor.addNextTrie(newTrie);
            cursor = cursor.nextTrie(string.charAt(i));
        }
    }

    private String evaluateTeams(BufferedReader br) throws IOException {
        int teamCount = Integer.parseInt(br.readLine());
        StringBuilder resultBuilder = new StringBuilder();
        for (int i = 0; i < teamCount; i++) {
            String teamName = br.readLine();
            List<Integer> matchedIndices = new ArrayList<>();
            this.markColorIndices(teamName, this.colorTrieRoot, matchedIndices);
            resultBuilder.append(this.checkNicknameMatch(teamName, matchedIndices)).append("\n");
        }
        return resultBuilder.toString();
    }

    private void markColorIndices(String string, Trie cursor, List<Integer> matchedIndices) {
        for (int i = 0; i < string.length(); i++) {
            cursor = cursor.nextTrie(string.charAt(i));
            if (cursor == null) return;
            if (cursor.isEnd && string.length() - (i + 1) <= 1000) matchedIndices.add(i);
        }
    }

    private String checkNicknameMatch(String string, List<Integer> matchedIndices) {
        for (Integer index : matchedIndices)
            if (this.nicknameSet.contains(string.substring(index + 1))) return "Yes";
        return "No";
    }

    private static class Trie {
        char character;
        Trie[] nextCharacters = new Trie[(int) 'z' - (int) 'a' + 1];
        boolean isEnd;

        public Trie(char character, boolean isEnd) {
            this.character = character;
            this.isEnd = isEnd;
        }

        public void addNextTrie(Trie trie) {
            int index = (int) trie.character - (int) 'a';
            if (nextCharacters[index] == null) nextCharacters[index] = trie;
            nextCharacters[index].isEnd = nextCharacters[index].isEnd || trie.isEnd;
        }

        public Trie nextTrie(char nextCharacter) {
            int index = (int) nextCharacter - (int) 'a';
            return nextCharacters[index];
        }
    }
}