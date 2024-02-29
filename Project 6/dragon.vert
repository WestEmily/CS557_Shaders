#version 330 compatibility

out vec2 vST; // texture coords
out vec3  vXYZ;
uniform float uMorph;

out vec3 vN; // normal vector
out vec3 vL; // vector from point to light
out vec3 vE; // vector from point to eye

const float TWOPI = 2.*3.14159265;
const vec3 LIGHTPOSITION = vec3( 5., 5., 0. );

void
main( )
{
	vST = gl_MultiTexCoord0.st;
	vXYZ = gl_Vertex.xyz;
	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex; // eye coordinate 

	vec4 vertex = gl_Vertex;
	vec3 normal0 = gl_Normal;
	vec3 normal = gl_Normal;

	float radius = 1. - vST.t;
	float theta = TWOPI * vST.s;
	vec4 circle = vec4(radius*cos(theta), radius*sin(theta), 0., 1.);
	vec3 circlenorm = vec3( 0., 0., 1. );


	// if ( var is higher than starting point, trasnform into rectangle)

	// if (var is lower than starting point, tranform into sphere)
	//if (uMorph < 0.)
	//{
		if (vXYZ.y >= 12. && abs(vXYZ.x) >= 3.85 || vXYZ.z <= -5. && abs(vXYZ.x) >= 3.)
		{	
			// blend
			// vec4 vertex = mix(gl_Vertex, circle, abs(uMorph));
			// vec3 normal = normalize( mix(normal0, circlenorm, abs(uMorph)));

			// vertex = mix(gl_Vertex, circle, 0.5);
			// normal = normalize( mix(normal0, circlenorm, 0.5));

			// vertex.xyz *= abs(uMorph) / length(vertex.xyz);

			// vertex.y += pow(uMorph, 2.) ;
			vertex.y = mix(vertex.y, pow(vertex.y, 2.), uMorph);

		}
	//}

	
	

	// if (vXYZ.y >= 12. && abs(vXYZ.x) >= 3.85 || vXYZ.z <= -5. && abs(vXYZ.x) >= 3.)
	// {
	//		myColor = vec3(1., 0., 0.);
	// }

	// if (var is at starting point, do nothing)


	vN = normalize( gl_NormalMatrix * normal ); // normal vector
	vL = LIGHTPOSITION - ECposition.xyz; // vector from the point to the light 
	vE = vec3( 0., 0., 0. ) - ECposition.xyz; // vector from the point to the eye position 
	// gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
	gl_Position = gl_ModelViewProjectionMatrix * vertex;
}