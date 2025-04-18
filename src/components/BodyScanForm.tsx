
import { useState } from "react";
import { Camera, Info } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select your gender.",
  }),
  measurementSystem: z.enum(["metric", "imperial"], {
    required_error: "Please select a measurement system.",
  }),
  height: z.string().min(1, "Please enter your height."),
  frontImage: z.instanceof(File).optional(),
  privacyConsent: z.literal(true, {
    invalid_type_error: "You must accept the privacy policy.",
  }),
});

type BodyScanFormValues = z.infer<typeof formSchema>;

interface BodyScanFormProps {
  onSubmit: (data: BodyScanFormValues) => void;
}

export default function BodyScanForm({ onSubmit }: BodyScanFormProps) {
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  
  const form = useForm<BodyScanFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "male",
      measurementSystem: "metric",
      height: "",
    },
  });
  
  const measurementSystem = form.watch("measurementSystem");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Basic validation - file type and size
      if (!file.type.includes("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG)",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFrontImagePreview(e.target?.result as string);
        form.setValue("frontImage", file);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleFormSubmit = (data: BodyScanFormValues) => {
    // Validate that image is uploaded before submission
    if (!form.getValues("frontImage")) {
      toast({
        title: "Image required",
        description: "Please upload a front view image",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(data);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
            
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-gray-800">Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="male" />
                        </FormControl>
                        <FormLabel className="cursor-pointer text-gray-800">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <FormLabel className="cursor-pointer text-gray-800">Female</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="other" />
                        </FormControl>
                        <FormLabel className="cursor-pointer text-gray-800">Other</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="measurementSystem"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-gray-800">Measurement System</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      variant="outline"
                      onValueChange={(value) => {
                        if (value) field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <ToggleGroupItem value="metric" aria-label="Metric">Metric (cm)</ToggleGroupItem>
                      <ToggleGroupItem value="imperial" aria-label="Imperial">Imperial (in)</ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800">Height</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder={measurementSystem === "metric" ? "Height in cm" : "Height in inches"}
                        {...field}
                        type="number"
                        className="text-gray-800 font-medium bg-white border-gray-300"
                      />
                      <span className="flex items-center text-sm text-gray-800">
                        {measurementSystem === "metric" ? "cm" : "in"}
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription className="text-gray-600">
                    This helps our AI calculate accurate proportions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Upload Front View Image</h2>
            <p className="text-sm text-gray-600">
              For best results, please upload a front-facing full-body image with a neutral background.
              Stand straight with arms slightly away from your body.
            </p>
            
            <div className="space-y-3">
              <Label htmlFor="frontImage">Front View</Label>
              <div 
                className={`border-2 border-dashed rounded-lg p-4 h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${
                  frontImagePreview ? "border-electric" : "border-gray-300"
                }`}
                onClick={() => document.getElementById("frontImage")?.click()}
              >
                {frontImagePreview ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={frontImagePreview} 
                      alt="Front view preview" 
                      className="h-full mx-auto object-contain"
                    />
                  </div>
                ) : (
                  <>
                    <Camera className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload front view</p>
                    <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
                  </>
                )}
                <Input 
                  type="file"
                  id="frontImage"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="privacyConsent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I consent to the processing of my data for measurement purposes
                  </FormLabel>
                  <FormDescription className="text-gray-600">
                    Your images are processed securely and not stored unless you opt in.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full bg-electric hover:bg-electric-dark">
            Generate Body Measurements
          </Button>
        </form>
      </Form>
    </div>
  );
}
