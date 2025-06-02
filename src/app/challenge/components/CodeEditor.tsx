import { Code } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LanguageOption } from "../types";
import { languageOptions, startingCodeTemplates } from "../constants";

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
    selectedLanguage: LanguageOption;
    setSelectedLanguage: (language: LanguageOption) => void;
}

export function CodeEditor({
    code,
    setCode,
    selectedLanguage,
    setSelectedLanguage,
}: CodeEditorProps) {
    return (
        <Card className="h-full flex flex-col border-2 overflow-hidden">
            <div className="bg-muted/50 p-4 border-b">
                <h2 className="font-semibold flex items-center gap-1.5 text-sm">
                    <Code className="h-3.5 w-3.5" />
                    Código
                </h2>
            </div>

            <div className="border-b bg-background p-4">
                <div className="flex justify-between items-center">
                    <Select
                        value={selectedLanguage.value}
                        onValueChange={(value) => {
                            const language = languageOptions.find((l) => l.value === value);
                            if (language) {
                                setSelectedLanguage(language);
                                setCode(
                                    startingCodeTemplates[value as keyof typeof startingCodeTemplates]
                                );
                            }
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border">
                            {languageOptions.map((lang) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                    {lang.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        onClick={() =>
                            setCode(
                                startingCodeTemplates[
                                selectedLanguage.value as keyof typeof startingCodeTemplates
                                ]
                            )
                        }
                        size="sm"
                    >
                        Reiniciar código
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-0 relative overflow-hidden">
                <CodeMirror
                    value={code}
                    height="100%"
                    theme={vscodeDark}
                    extensions={[selectedLanguage.extension({ jsx: true })]}
                    onChange={(value) => setCode(value)}
                    className="text-sm absolute inset-0 overflow-hidden"
                />
            </div>
        </Card>
    );
} 