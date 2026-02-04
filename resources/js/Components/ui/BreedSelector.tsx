import { useState, useMemo } from "react";
import {
    Combobox,
    ComboboxInput,
    ComboboxButton,
    ComboboxOptions,
    ComboboxOption,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { usePage } from "@inertiajs/react";
import clsx from "clsx";

interface BreedSelectorProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    label?: string;
    required?: boolean;
}

export default function BreedSelector({
    value,
    onChange,
    error,
    label = "Breed",
    required = false,
}: BreedSelectorProps) {
    const { breeds } = usePage<{ breeds: string[] }>().props;
    const [query, setQuery] = useState("");
    const [isMixed, setIsMixed] = useState(value.includes(" / "));
    const [secondBreed, setSecondBreed] = useState(() => {
        if (value.includes(" / ")) {
            const parts = value.split(" / ");
            return parts[1] || "";
        }
        return "";
    });
    const [secondQuery, setSecondQuery] = useState("");

    const primaryBreed = useMemo(() => {
        if (value.includes(" / ")) {
            return value.split(" / ")[0];
        }
        return value;
    }, [value]);

    const filteredBreeds = useMemo(() => {
        if (query === "") return breeds;
        return breeds.filter((breed) =>
            breed.toLowerCase().includes(query.toLowerCase())
        );
    }, [breeds, query]);

    const filteredBreedsSecond = useMemo(() => {
        if (secondQuery === "") return breeds;
        return breeds.filter((breed) =>
            breed.toLowerCase().includes(secondQuery.toLowerCase())
        );
    }, [breeds, secondQuery]);

    const handlePrimaryChange = (newValue: string | null) => {
        const breed = newValue || query;
        if (isMixed && secondBreed) {
            onChange(`${breed} / ${secondBreed}`);
        } else {
            onChange(breed);
        }
    };

    const handleSecondChange = (newValue: string | null) => {
        const breed = newValue || secondQuery;
        setSecondBreed(breed);
        onChange(`${primaryBreed} / ${breed}`);
    };

    const handleMixedToggle = (checked: boolean) => {
        setIsMixed(checked);
        if (!checked) {
            setSecondBreed("");
            onChange(primaryBreed);
        } else if (secondBreed) {
            onChange(`${primaryBreed} / ${secondBreed}`);
        }
    };

    const inputClasses = clsx(
        "block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm",
        "ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
        error
            ? "ring-red-300 focus:ring-red-500"
            : "ring-gray-300 focus:ring-primary-600"
    );

    const optionClasses = clsx(
        "relative cursor-default select-none py-2 pl-3 pr-9",
        "data-[focus]:bg-primary-600 data-[focus]:text-white text-gray-900"
    );

    return (
        <div className="space-y-3">
            {/* Primary Breed */}
            <div>
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label} {required && "*"}
                    </label>
                )}
                <Combobox
                    value={primaryBreed}
                    onChange={handlePrimaryChange}
                    onClose={() => setQuery("")}
                >
                    <div className="relative">
                        <ComboboxInput
                            className={inputClasses}
                            onChange={(e) => setQuery(e.target.value)}
                            displayValue={(breed: string) => breed}
                            placeholder="Search or type breed..."
                        />
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </ComboboxButton>
                        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {query && !breeds.includes(query) && (
                                <ComboboxOption
                                    value={query}
                                    className={optionClasses}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={clsx(
                                                    "block truncate",
                                                    selected && "font-semibold"
                                                )}
                                            >
                                                Add "{query}"
                                            </span>
                                        </>
                                    )}
                                </ComboboxOption>
                            )}
                            {filteredBreeds.map((breed) => (
                                <ComboboxOption
                                    key={breed}
                                    value={breed}
                                    className={optionClasses}
                                >
                                    {({ selected, focus }) => (
                                        <>
                                            <span
                                                className={clsx(
                                                    "block truncate",
                                                    selected && "font-semibold"
                                                )}
                                            >
                                                {breed}
                                            </span>
                                            {selected && (
                                                <span
                                                    className={clsx(
                                                        "absolute inset-y-0 right-0 flex items-center pr-4",
                                                        focus
                                                            ? "text-white"
                                                            : "text-primary-600"
                                                    )}
                                                >
                                                    <CheckIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </ComboboxOption>
                            ))}
                            {filteredBreeds.length === 0 && !query && (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                    Start typing to search breeds...
                                </div>
                            )}
                        </ComboboxOptions>
                    </div>
                </Combobox>
            </div>

            {/* Mixed Breed Toggle */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="mixed-breed"
                    checked={isMixed}
                    onChange={(e) => handleMixedToggle(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                />
                <label
                    htmlFor="mixed-breed"
                    className="text-sm text-gray-600 cursor-pointer"
                >
                    Mixed / Cross breed
                </label>
            </div>

            {/* Second Breed (for mixed) */}
            {isMixed && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Second Breed
                    </label>
                    <Combobox
                        value={secondBreed}
                        onChange={handleSecondChange}
                        onClose={() => setSecondQuery("")}
                    >
                        <div className="relative">
                            <ComboboxInput
                                className={inputClasses}
                                onChange={(e) => setSecondQuery(e.target.value)}
                                displayValue={(breed: string) => breed}
                                placeholder="Search or type second breed..."
                            />
                            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </ComboboxButton>
                            <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {secondQuery &&
                                    !breeds.includes(secondQuery) && (
                                        <ComboboxOption
                                            value={secondQuery}
                                            className={optionClasses}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span
                                                        className={clsx(
                                                            "block truncate",
                                                            selected &&
                                                                "font-semibold"
                                                        )}
                                                    >
                                                        Add "{secondQuery}"
                                                    </span>
                                                </>
                                            )}
                                        </ComboboxOption>
                                    )}
                                {filteredBreedsSecond.map((breed) => (
                                    <ComboboxOption
                                        key={breed}
                                        value={breed}
                                        className={optionClasses}
                                    >
                                        {({ selected, focus }) => (
                                            <>
                                                <span
                                                    className={clsx(
                                                        "block truncate",
                                                        selected &&
                                                            "font-semibold"
                                                    )}
                                                >
                                                    {breed}
                                                </span>
                                                {selected && (
                                                    <span
                                                        className={clsx(
                                                            "absolute inset-y-0 right-0 flex items-center pr-4",
                                                            focus
                                                                ? "text-white"
                                                                : "text-primary-600"
                                                        )}
                                                    >
                                                        <CheckIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </div>
                    </Combobox>
                </div>
            )}

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
